import { Link } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { paths } from '@/config/paths'
import { useTranslation } from '@/lib/i18n'

export default function PricePage() {
  const { t } = useTranslation('marketing')
  return (
    <PageContainer width="narrow" className="space-y-8 py-10">
      <PageHeader title={t('pricing.title')} description={t('pricing.description')} />
      <section className="space-y-5 rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="space-y-2">
          <h2 className="text-base font-semibold text-foreground">{t('pricing.itemBased.title')}</h2>
          <p className="text-sm leading-6 text-muted-foreground">{t('pricing.itemBased.body')}</p>
        </div>
        <div className="space-y-2">
          <h2 className="text-base font-semibold text-foreground">{t('pricing.booking.title')}</h2>
          <p className="text-sm leading-6 text-muted-foreground">{t('pricing.booking.body')}</p>
        </div>
        <div className="space-y-2">
          <h2 className="text-base font-semibold text-foreground">{t('pricing.support.title')}</h2>
          <p className="text-sm leading-6 text-muted-foreground">{t('pricing.support.body')}</p>
        </div>
        <Button asChild><Link to={paths.productCatalog}>{t('pricing.action')}</Link></Button>
      </section>
    </PageContainer>
  )
}
