//src/features/auth/components/RegisterForm.tsx
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { paths } from '@/config/paths'
import { getErrorMessage } from '@/lib/errors'
import { useRegister } from '../hooks/useAuthMutations'
import { registerSchema, type RegisterPayload } from '../schemas/auth.schema'
import { FormError } from './FormError'
import { PasswordHint } from './PasswordHint'

export function RegisterForm() {
  const navigate = useNavigate()
  const { mutate, isPending, error } = useRegister()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterPayload>({ resolver: zodResolver(registerSchema) })

  const onSubmit = (data: RegisterPayload) =>
    mutate(data, {
      onSuccess: () =>
        navigate(`${paths.verifyEmail}?${new URLSearchParams({ email: data.email })}`),
    })

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormError message={error ? getErrorMessage(error) : undefined} />

      <Input label="Name" autoComplete="name"
        {...register('name')} error={errors.name?.message} />
      <Input label="Email" type="email" autoComplete="email"
        {...register('email')} error={errors.email?.message} />
      <div className="space-y-1.5">
        <Input label="Password" type="password" autoComplete="new-password"
          {...register('password')} error={errors.password?.message} />
        <PasswordHint />
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Creating account...' : 'Create account'}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        By creating an account you agree to the{' '}
        <Link to={paths.terms} className="text-primary hover:underline">Terms of Service</Link>{' '}
        and{' '}
        <Link to={paths.privacy} className="text-primary hover:underline">Privacy Policy</Link>.
      </p>
    </form>
  )
}