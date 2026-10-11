//src/features/auth/components/ChangePasswordForm.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getErrorMessage } from '@/lib/errors'
import { useTranslation } from '@/lib/i18n'
import { translateMessage } from '@/lib/i18n/translate'
import { useChangePassword } from '../hooks/useSessions'
import { changePasswordSchema, type ChangePasswordForm as Values } from '../schemas/auth.schema'
import { FormError } from './FormError'
import { PasswordHint } from './PasswordHint'

export function ChangePasswordForm() {
  const { t } = useTranslation('auth')
  const { mutate, isPending, error } = useChangePassword()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(changePasswordSchema) })

  const onSubmit = ({ currentPassword, newPassword }: Values) =>
    mutate(
      { currentPassword: currentPassword || undefined, newPassword },
      {
        onSuccess: () => {
          toast.success(t('changePassword.success'))
          reset()
        },
      }
    )

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormError message={error ? getErrorMessage(error) : undefined} />
      <Input label={t('changePassword.current')} type="password" autoComplete="current-password"
        {...register('currentPassword')} error={translateMessage(t, errors.currentPassword?.message)} />
      <div className="space-y-1.5">
        <Input label={t('changePassword.new')} type="password" autoComplete="new-password"
          {...register('newPassword')} error={translateMessage(t, errors.newPassword?.message)} />
        <PasswordHint />
      </div>
      <Input label={t('changePassword.confirm')} type="password" autoComplete="new-password"
        {...register('confirmPassword')} error={translateMessage(t, errors.confirmPassword?.message)} />
      <Button type="submit" disabled={isPending}>
        {isPending ? t('changePassword.submitting') : t('changePassword.submit')}
      </Button>
    </form>
  )
}