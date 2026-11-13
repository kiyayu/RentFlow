import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { paths } from '@/config/paths'
import { getErrorMessage } from '@/lib/errors'
import { useTranslation } from '@/lib/i18n'
import { useDemoLogin } from '../hooks/useLogin'
import { getSafeRedirect } from '../redirect'
import { FormError } from './FormError'

export function DemoLoginButton() {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { mutate, isPending, error } = useDemoLogin()

  const startDemo = () => {
    mutate(undefined, {
      onSuccess: () => navigate(getSafeRedirect(searchParams.get('redirect')) || paths.app.dashboard, { replace: true }),
    })
  }

  return (
    <div className="space-y-3">
      <FormError message={error ? getErrorMessage(error) : undefined} />
      <Button type="button" variant="secondary" className="w-full" disabled={isPending} onClick={startDemo}>
        {isPending ? t('demo.starting') : t('demo.start')}
      </Button>
    </div>
  )
}
