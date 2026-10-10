//src/features/auth/components/ChangePasswordForm.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getErrorMessage } from '@/lib/errors'
import { useChangePassword } from '../hooks/useSessions'
import { changePasswordSchema, type ChangePasswordForm as Values } from '../schemas/auth.schema'
import { FormError } from './FormError'
import { PasswordHint } from './PasswordHint'

export function ChangePasswordForm() {
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
          toast.success('Password updated')
          reset()
        },
      }
    )

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormError message={error ? getErrorMessage(error) : undefined} />
      <Input label="Current password" type="password" autoComplete="current-password"
        {...register('currentPassword')} error={errors.currentPassword?.message} />
      <div className="space-y-1.5">
        <Input label="New password" type="password" autoComplete="new-password"
          {...register('newPassword')} error={errors.newPassword?.message} />
        <PasswordHint />
      </div>
      <Input label="Confirm new password" type="password" autoComplete="new-password"
        {...register('confirmPassword')} error={errors.confirmPassword?.message} />
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Saving...' : 'Update password'}
      </Button>
    </form>
  )
}