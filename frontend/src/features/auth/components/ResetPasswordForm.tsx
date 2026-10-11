//src/features/auth/components/ResetPasswordForm.tsx
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
import { useResetPassword } from '../hooks/useAuthMutations'
import { resetPasswordSchema, type ResetPasswordForm as ResetValues } from '../schemas/auth.schema'
import { FormError } from './FormError'
import { PasswordHint } from './PasswordHint'

export function ResetPasswordForm({ token }: { token: string }) {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const { mutate, isPending, error } = useResetPassword()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetValues>({ resolver: zodResolver(resetPasswordSchema) })

  // confirmPassword is dropped on purpose: the backend uses .strict()
  const onSubmit = ({ newPassword }: ResetValues) =>
    mutate(
      { token, newPassword },
      {
        onSuccess: () => {
          toast.success(t('reset.success'))
          navigate(paths.login, { replace: true })
        },
      }
    )

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormError message={error ? getErrorMessage(error) : undefined} />
      <div className="space-y-1.5">
        <Input label={t('reset.newPassword')} type="password" autoComplete="new-password"
          {...register('newPassword')} error={translateMessage(t, errors.newPassword?.message)} />
        <PasswordHint />
      </div>
      <Input label={t('reset.confirmPassword')} type="password" autoComplete="new-password"
        {...register('confirmPassword')} error={translateMessage(t, errors.confirmPassword?.message)} />
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? t('reset.submitting') : t('reset.submit')}
      </Button>
    </form>
  )
}