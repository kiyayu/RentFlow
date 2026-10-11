//src/features/auth/pages/ForgotPasswordPage.tsx
import { paths } from '@/config/paths'
import { useTranslation } from '@/lib/i18n'
import { AuthHeading } from '../components/AuthHeading'
import { AuthSwitch } from '../components/AuthSwitch'
import { ForgotPasswordForm } from '../components/ForgotPasswordForm'

export default function ForgotPasswordPage() {
  const { t } = useTranslation('auth')
  return (
    <>
      <AuthHeading title={t('forgot.title')} description={t('forgot.description')} />
      <ForgotPasswordForm />
      <AuthSwitch text={t('forgot.remembered')} label={t('forgot.logIn')} to={paths.login} />
    </>
  )
}