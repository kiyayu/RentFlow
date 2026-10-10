//src/features/auth/pages/RegisterPage.tsx
import { paths } from '@/config/paths'
import { AuthHeading } from '../components/AuthHeading'
import { AuthSwitch } from '../components/AuthSwitch'
import { GoogleButton } from '../components/GoogleButton'
import { RegisterForm } from '../components/RegisterForm'

export default function RegisterPage() {
  return (
    <>
      <AuthHeading title="Create your account" description="It only takes a minute." />
      <RegisterForm />
      <GoogleButton />
      <AuthSwitch text="Already have an account?" label="Log in" to={paths.login} />
    </>
  )
}