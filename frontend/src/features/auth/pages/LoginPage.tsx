//src/features/auth/pages/LoginPage.tsx
import { useSearchParams } from 'react-router-dom'
import { paths } from '@/config/paths'
import { AuthHeading } from '../components/AuthHeading'
import { AuthSwitch } from '../components/AuthSwitch'
import { FormError } from '../components/FormError'
import { GoogleButton } from '../components/GoogleButton'
import { LoginForm } from '../components/LoginForm'

export default function LoginPage() {
  const [searchParams] = useSearchParams()
  const googleFailed = searchParams.get('error') === 'google'

  return (
    <>
      <AuthHeading title="Welcome back" description="Log in to your account." />
      <FormError message={googleFailed ? 'Google sign-in failed. Please try again.' : undefined} />
      <LoginForm />
      <GoogleButton />
      <AuthSwitch text="No account yet?" label="Sign up" to={paths.register} />
    </>
  )
}