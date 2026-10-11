//src/features/auth/components/RegisterForm.tsx
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { paths } from '@/config/paths'
import { getErrorMessage } from '@/lib/errors'
import { Trans, useTranslation } from '@/lib/i18n'
import { translateMessage } from '@/lib/i18n/translate'
import { useRegister } from '../hooks/useAuthMutations'
import { registerSchema, type RegisterPayload } from '../schemas/auth.schema'
import { FormError } from './FormError'
import { PasswordHint } from './PasswordHint'

export function RegisterForm() {
  const { t } = useTranslation('auth')
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

      <Input label={t('register.name')} autoComplete="name"
        {...register('name')} error={translateMessage(t, errors.name?.message)} />
      <Input label={t('register.email')} type="email" autoComplete="email"
        {...register('email')} error={translateMessage(t, errors.email?.message)} />
      <div className="space-y-1.5">
        <Input label={t('register.password')} type="password" autoComplete="new-password"
          {...register('password')} error={translateMessage(t, errors.password?.message)} />
        <PasswordHint />
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? t('register.submitting') : t('register.submit')}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        <Trans
          i18nKey="register.consent"
          ns="auth"
          components={{
            terms: <Link to={paths.terms} className="text-primary hover:underline" />,
            privacy: <Link to={paths.privacy} className="text-primary hover:underline" />,
          }}
        />
      </p>
    </form>
  )
}