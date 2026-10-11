//src/features/auth/pages/ResetPasswordPage.tsx
import { Link, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { paths } from '@/config/paths'
import { useTranslation } from '@/lib/i18n'
import { AuthHeading } from '../components/AuthHeading'
import { ResetPasswordForm } from '../components/ResetPasswordForm'

export default function ResetPasswordPage() {
  const { t } = useTranslation('auth')
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  if (!token) {
    return (
      <>
        <AuthHeading title={t('reset.invalidTitle')} description={t('reset.invalidDescription')} />
        <Button asChild className="w-full">
          <Link to={paths.forgotPassword}>{t('reset.requestNew')}</Link>
        </Button>
      </>
    )
  }

  return (
    <>
      <AuthHeading title={t('reset.title')} description={t('reset.description')} />
      <ResetPasswordForm token={token} />
    </>
  )
}