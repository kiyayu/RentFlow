//src/features/auth/pages/VerifyEmailPage.tsx
import { Navigate, useSearchParams } from 'react-router-dom'
import { paths } from '@/config/paths'
import { useTranslation } from '@/lib/i18n'
import { AuthHeading } from '../components/AuthHeading'
import { AuthSwitch } from '../components/AuthSwitch'
import { VerifyOtpForm } from '../components/VerifyOtpForm'

export default function VerifyEmailPage() {
  const { t } = useTranslation('auth')
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email')

  if (!email) return <Navigate to={paths.register} replace />

  return (
    <>
      <AuthHeading title={t('verify.title')} description={t('verify.description', { email })} />
      <VerifyOtpForm email={email} />
      <AuthSwitch text={t('verify.wrongEmail')} label={t('verify.startOver')} to={paths.register} />
    </>
  )
}