//src/features/marketing/components/CtaBanner.tsx
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { paths } from '@/config/paths'
import { useTranslation } from '@/lib/i18n'

export function CtaBanner() {
  const { t } = useTranslation('marketing')
  return (
    <section className="p-8 space-y-4 text-center bg-card border border-border rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold text-foreground">{t('cta.title')}</h2>
      <p className="text-sm text-muted-foreground">{t('cta.description')}</p>
      <Button asChild>
        <Link to={paths.register}>{t('cta.button')}</Link>
      </Button>
    </section>
  )
}