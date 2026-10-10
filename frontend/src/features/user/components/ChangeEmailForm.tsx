//src/features/user/components/ChangeEmailForm.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getErrorMessage } from '@/lib/errors'
import { sessionQueryOptions } from '@/features/auth'
import { useChangeEmail } from '../hooks/useUserMutations'
import { changeEmailSchema, type ChangeEmailForm as Values } from '../schemas/user.schema'

export function ChangeEmailForm() {
  const { data: user } = useQuery(sessionQueryOptions)
  const { mutate, isPending, error } = useChangeEmail()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(changeEmailSchema) })

  const onSubmit = (data: Values) =>
    mutate(data, {
      onSuccess: () => {
        toast.success('Email updated')
        reset()
      },
    })

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      {error && (
        <p role="alert" className="px-3 py-2 text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg">
          {getErrorMessage(error)}
        </p>
      )}
      <p className="text-sm text-muted-foreground">
        Current email: <span className="font-medium text-foreground">{user?.email}</span>
      </p>
      <Input label="New email" type="email" autoComplete="email"
        {...register('newEmail')} error={errors.newEmail?.message} />
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Saving...' : 'Change email'}
      </Button>
    </form>
  )
}