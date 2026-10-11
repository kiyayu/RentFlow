//src/components/layout/ErrorPage.tsx
import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { paths } from '@/config/paths'
import { useTranslation } from '@/lib/i18n'

export function ErrorPage({
  homePath = paths.home,
  homeLabel,
}: {
  homePath?: string
  homeLabel?: string // override only when a caller needs different wording
}) {
  const { t } = useTranslation(['errors', 'common'])
  const error = useRouteError()
  const isNotFound = isRouteErrorResponse(error) && error.status === 404

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh p-4 space-y-6 text-center bg-background">
      <div className="space-y-2">
        <p className="text-sm font-medium text-primary">
          {isNotFound ? t('errors:page.notFoundLabel') : t('errors:page.genericLabel')}
        </p>
        <h1 className="text-xl font-semibold text-foreground">
          {isNotFound ? t('errors:page.notFoundTitle') : t('errors:page.genericTitle')}
        </h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          {isNotFound ? t('errors:page.notFoundDescription') : t('errors:page.genericDescription')}
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        {!isNotFound && (
          <Button variant="outline" onClick={() => window.location.reload()}>
            {t('common:actions.tryAgain')}
          </Button>
        )}
        <Button asChild>
          <Link to={homePath}>{homeLabel ?? t('common:actions.goHome')}</Link>
        </Button>
      </div>
    </div>
  )
}