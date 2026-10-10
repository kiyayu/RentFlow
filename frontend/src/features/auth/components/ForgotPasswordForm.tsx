//src/features/auth/components/ForgotPasswordForm.tsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { paths } from '@/config/paths'
import { getErrorMessage } from '@/lib/errors'
import { useForgotPassword } from '../hooks/useAuthMutations'
import { forgotPasswordSchema, type ForgotPasswordPayload } from '../schemas/auth.schema'
import { FormError } from './FormError'

export function ForgotPasswordForm() {
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
          If an account exists for <span className="font-medium">{sentTo}</span>, we sent a
          link to reset the password. Check your inbox.
        </p>
        <Button asChild variant="outline" className="w-full">
          <Link to={paths.login}>Back to log in</Link>
        </Button>
      </div>
    )
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormError message={error ? getErrorMessage(error) : undefined} />
      <Input label="Email" type="email" autoComplete="email"
        {...register('email')} error={errors.email?.message} />
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Sending...' : 'Send reset link'}
      </Button>
    </form>
  )
}