//src/components/layout/ErrorPanel.tsx
import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { paths } from '@/config/paths'
import { useTranslation } from '@/lib/i18n'

export function ErrorPanel() {
  const { t } = useTranslation(['errors', 'common'])
  const error = useRouteError()
  const isNotFound = isRouteErrorResponse(error) && error.status === 404

  return (
    <div className="flex flex-col items-center justify-center p-6 py-20 space-y-6 text-center">
      <div className="space-y-2">
        <p className="text-sm font-medium text-primary">
          {isNotFound ? t('errors:page.notFoundLabel') : t('errors:page.genericLabel')}
        </p>
        <h1 className="text-xl font-semibold text-foreground">
          {isNotFound ? t('errors:page.notFoundTitle') : t('errors:page.genericTitle')}
        </h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          {isNotFound ? t('errors:panel.notFoundDescription') : t('errors:panel.genericDescription')}
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        {!isNotFound && (
          <Button variant="outline" onClick={() => window.location.reload()}>
            {t('common:actions.tryAgain')}
          </Button>
        )}
        <Button asChild>
          <Link to={paths.app.dashboard}>{t('common:actions.backToDashboard')}</Link>
        </Button>
      </div>
    </div>
  )
}