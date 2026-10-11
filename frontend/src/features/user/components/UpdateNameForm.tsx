//src/features/user/components/UpdateNameForm.tsx
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getErrorMessage } from '@/lib/errors'
import { useTranslation } from '@/lib/i18n'
import { translateMessage } from '@/lib/i18n/translate'
import { sessionQueryOptions } from '@/features/auth'
import { useUpdateName } from '../hooks/useUserMutations'
import { updateNameSchema, type UpdateNameForm as Values } from '../schemas/user.schema'

export function UpdateNameForm() {
  const { t } = useTranslation('settings')
  const { data: user } = useQuery(sessionQueryOptions)
  const { mutate, isPending, error } = useUpdateName()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<Values>({
    resolver: zodResolver(updateNameSchema),
    defaultValues: { name: user?.name ?? '' },
  })

  // keep the field in sync if the session loads or changes
  useEffect(() => {
    if (user) reset({ name: user.name })
  }, [user, reset])

  const onSubmit = (data: Values) =>
    mutate(data, { onSuccess: () => toast.success(t('profile.saved')) })

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      {error && (
        <p role="alert" className="px-3 py-2 text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg">
          {getErrorMessage(error)}
        </p>
      )}
      <Input label={t('profile.name')} autoComplete="name" {...register('name')}
        error={translateMessage(t, errors.name?.message)} />
      <Button type="submit" disabled={isPending || !isDirty}>
        {isPending ? t('status.saving', { ns: 'common' }) : t('profile.save')}
      </Button>
    </form>
  )
}