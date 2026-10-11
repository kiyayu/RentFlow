//src/features/auth/pages/LoginPage.tsx
import { useSearchParams } from 'react-router-dom'
import { paths } from '@/config/paths'
import { useTranslation } from '@/lib/i18n'
import { AuthHeading } from '../components/AuthHeading'
import { AuthSwitch } from '../components/AuthSwitch'
import { FormError } from '../components/FormError'
import { GoogleButton } from '../components/GoogleButton'
import { LoginForm } from '../components/LoginForm'

export default function LoginPage() {
  const { t } = useTranslation('auth')
  const [searchParams] = useSearchParams()
  const googleFailed = searchParams.get('error') === 'google'

  return (
    <>
      <AuthHeading title={t('login.title')} description={t('login.description')} />
      <FormError message={googleFailed ? t('login.googleFailed') : undefined} />
      <LoginForm />
      <GoogleButton />
      <AuthSwitch text={t('login.noAccount')} label={t('login.signUp')} to={paths.register} />
    </>
  )
}