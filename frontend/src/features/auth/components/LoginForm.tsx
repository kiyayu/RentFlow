//src/features/auth/components/LoginForm.tsx
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { paths } from '@/config/paths'
import { getErrorMessage } from '@/lib/errors'
import { useTranslation } from '@/lib/i18n'
import { translateMessage } from '@/lib/i18n/translate'
import { useLogin } from '../hooks/useLogin'
import { getSafeRedirect } from '../redirect'
import { loginSchema, type LoginPayload } from '../schemas/auth.schema'
import { FormError } from './FormError'

// Matches the backend message exactly. If the wording changes, only this line breaks.
const UNVERIFIED_MESSAGE = 'Please verify your email before logging in'

export function LoginForm() {
  const { t } = useTranslation('auth')
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { mutate, isPending, error } = useLogin()

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<LoginPayload>({ resolver: zodResolver(loginSchema) })

  const onSubmit = (data: LoginPayload) =>
    mutate(data, {
      onSuccess: () =>
        navigate(getSafeRedirect(searchParams.get('redirect')), { replace: true }),
    })

  const message = error ? getErrorMessage(error) : undefined
  const needsVerification = message === UNVERIFIED_MESSAGE

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormError message={message} />
      {needsVerification && (
        <p className="text-sm text-center">
          <Link
            to={`${paths.verifyEmail}?${new URLSearchParams({ email: getValues('email') })}`}
            className="font-medium text-primary hover:underline"
          >
            {t('login.verifyLink')}
          </Link>
        </p>
      )}

      <Input label={t('login.email')} type="email" autoComplete="email"
        {...register('email')} error={translateMessage(t, errors.email?.message)} />
      <Input label={t('login.password')} type="password" autoComplete="current-password"
        {...register('password')} error={translateMessage(t, errors.password?.message)} />

      <div className="text-right">
        <Link to={paths.forgotPassword} className="text-sm text-primary hover:underline">
          {t('login.forgot')}
        </Link>
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? t('login.submitting') : t('login.submit')}
      </Button>
    </form>
  )
}