//src/features/auth/pages/ForgotPasswordPage.tsx
import { paths } from '@/config/paths'
import { AuthHeading } from '../components/AuthHeading'
import { AuthSwitch } from '../components/AuthSwitch'
import { ForgotPasswordForm } from '../components/ForgotPasswordForm'

export default function ForgotPasswordPage() {
  return (
    <>
      <AuthHeading title="Forgot your password?"
        description="Enter your email and we will send you a reset link." />
      <ForgotPasswordForm />
      <AuthSwitch text="Remembered it?" label="Log in" to={paths.login} />
    </>
  )
}