//src/features/auth/pages/ResetPasswordPage.tsx
import { Link, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { paths } from '@/config/paths'
import { AuthHeading } from '../components/AuthHeading'
import { ResetPasswordForm } from '../components/ResetPasswordForm'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  if (!token) {
    return (
      <>
        <AuthHeading title="Invalid reset link"
          description="This link is missing its token or has expired." />
        <Button asChild className="w-full">
          <Link to={paths.forgotPassword}>Request a new link</Link>
        </Button>
      </>
    )
  }

  return (
    <>
      <AuthHeading title="Set a new password"
        description="Choose a password you have not used before." />
      <ResetPasswordForm token={token} />
    </>
  )
}