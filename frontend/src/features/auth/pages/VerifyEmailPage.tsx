//src/features/auth/pages/VerifyEmailPage.tsx
import { Navigate, useSearchParams } from 'react-router-dom'
import { paths } from '@/config/paths'
import { AuthHeading } from '../components/AuthHeading'
import { AuthSwitch } from '../components/AuthSwitch'
import { VerifyOtpForm } from '../components/VerifyOtpForm'

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email')

  if (!email) return <Navigate to={paths.register} replace />

  return (
    <>
      <AuthHeading title="Check your email" description={`We sent a 6-digit code to ${email}.`} />
      <VerifyOtpForm email={email} />
      <AuthSwitch text="Wrong email?" label="Start over" to={paths.register} />
    </>
  )
}