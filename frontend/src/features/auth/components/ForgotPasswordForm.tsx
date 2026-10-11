//src/features/auth/components/ForgotPasswordForm.tsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { paths } from '@/config/paths'
import { getErrorMessage } from '@/lib/errors'
import { Trans, useTranslation } from '@/lib/i18n'
import { translateMessage } from '@/lib/i18n/translate'
import { useForgotPassword } from '../hooks/useAuthMutations'
import { forgotPasswordSchema, type ForgotPasswordPayload } from '../schemas/auth.schema'
import { FormError } from './FormError'

export function ForgotPasswordForm() {
  const { t } = useTranslation('auth')
  const [sentTo, setSentTo] = useState<string | null>(null)
  const { mutate, isPending, error } = useForgotPassword()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordPayload>({ resolver: zodResolver(forgotPasswordSchema) })

  const onSubmit = (data: ForgotPasswordPayload) =>
    mutate(data, { onSuccess: () => setSentTo(data.email) })

  // Neutral wording on purpose: never confirm whether an account exists.
  if (sentTo) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-foreground">
          <Trans
            i18nKey="forgot.sent"
            ns="auth"
            values={{ email: sentTo }}
            components={{ b: <span className="font-medium" /> }}
          />
        </p>
        <Button asChild variant="outline" className="w-full">
          <Link to={paths.login}>{t('forgot.backToLogin')}</Link>
        </Button>
      </div>
    )
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormError message={error ? getErrorMessage(error) : undefined} />
      <Input label={t('forgot.email')} type="email" autoComplete="email"
        {...register('email')} error={translateMessage(t, errors.email?.message)} />
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? t('forgot.submitting') : t('forgot.submit')}
      </Button>
    </form>
  )
}