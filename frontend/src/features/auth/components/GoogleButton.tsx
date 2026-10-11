//src/features/auth/components/GoogleButton.tsx
import { Button } from '@/components/ui/button'
import { API_BASE_URL } from '@/lib/axios'
import { useTranslation } from '@/lib/i18n'

// Full-page navigation on purpose: /auth/google redirects to Google, not JSON.
const googleUrl = `${API_BASE_URL.replace(/\/$/, '')}/auth/google`

export function GoogleButton() {
  const { t } = useTranslation('auth')
  return (
    <>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        {t('google.or')}
        <span className="h-px flex-1 bg-border" />
      </div>
      <Button asChild variant="outline" className="w-full">
        <a href={googleUrl}>{t('google.continue')}</a>
      </Button>
    </>
  )
}