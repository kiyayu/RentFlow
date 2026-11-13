//src/features/auth/pages/RegisterPage.tsx
import { paths } from '@/config/paths'
import { useTranslation } from '@/lib/i18n'
import { AuthHeading } from '../components/AuthHeading'
import { AuthSwitch } from '../components/AuthSwitch'
import { GoogleButton } from '../components/GoogleButton'
import { RegisterForm } from '../components/RegisterForm'
import { DemoLoginButton } from '../components/DemoLoginButton'

export default function RegisterPage() {
  const { t } = useTranslation('auth')
  return (
    <>
      <AuthHeading title={t('register.title')} description={t('register.description')} />
      <RegisterForm />
      <DemoLoginButton />
      <GoogleButton />
      <AuthSwitch text={t('register.hasAccount')} label={t('register.logIn')} to={paths.login} />
    </>
  )
}
