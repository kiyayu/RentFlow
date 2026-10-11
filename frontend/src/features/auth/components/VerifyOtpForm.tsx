//src/features/auth/components/VerifyOtpForm.tsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { paths } from '@/config/paths'
import { getErrorMessage } from '@/lib/errors'
import { useTranslation } from '@/lib/i18n'
import { translateMessage } from '@/lib/i18n/translate'
import { useResendOtp, useVerifyOtp } from '../hooks/useAuthMutations'
import { verifyOtpSchema, type VerifyOtpForm as VerifyOtpValues } from '../schemas/auth.schema'
import { FormError } from './FormError'

const RESEND_SECONDS = 30

export function VerifyOtpForm({ email }: { email: string }) {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const verify = useVerifyOtp()
  const resend = useResendOtp()
  const [cooldown, setCooldown] = useState(0)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyOtpValues>({ resolver: zodResolver(verifyOtpSchema) })

  useEffect(() => {
    if (cooldown <= 0) return
    const id = window.setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => window.clearTimeout(id)
  }, [cooldown])

  const onSubmit = ({ otp }: VerifyOtpValues) =>
    verify.mutate(
      { email, otp },
      {
        onSuccess: () => {
          toast.success(t('verify.success'))
          navigate(paths.login, { replace: true })
        },
      }
    )

  const onResend = () =>
    resend.mutate(
      { email },
      {
        onSuccess: () => {
          toast.success(t('verify.resent'))
          setCooldown(RESEND_SECONDS)
        },
        onError: (error) => toast.error(getErrorMessage(error)),
      }
    )

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormError message={verify.error ? getErrorMessage(verify.error) : undefined} />

      <Input label={t('verify.code')} inputMode="numeric" autoComplete="one-time-code"
        maxLength={6} placeholder="123456"
        {...register('otp')} error={translateMessage(t, errors.otp?.message)} />

      <Button type="submit" className="w-full" disabled={verify.isPending}>
        {verify.isPending ? t('verify.submitting') : t('verify.submit')}
      </Button>

      <Button type="button" variant="ghost" className="w-full"
        disabled={resend.isPending || cooldown > 0} onClick={onResend}>
        {cooldown > 0 ? t('verify.resendIn', { seconds: cooldown }) : t('verify.resend')}
      </Button>
    </form>
  )
}