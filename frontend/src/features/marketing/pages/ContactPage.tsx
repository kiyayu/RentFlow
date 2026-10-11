//src/features/marketing/pages/ContactPage.tsx
import { Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/layout/PageHeader'
import { site } from '@/config/site'
import { useTranslation } from '@/lib/i18n'

export default function ContactPage() {
  const { t } = useTranslation('marketing')
  return (
    <PageContainer width="narrow">
      <PageHeader title={t('contact.title')} description={t('contact.description')} />
      <div className="p-6 space-y-4 bg-card border border-border rounded-xl shadow-sm">
        <p className="text-sm text-foreground">{t('contact.body')}</p>
        <Button asChild>
          <a href={`mailto:${site.supportEmail}`}>
            <Mail className="size-4" />
            {site.supportEmail}
          </a>
        </Button>
      </div>
    </PageContainer>
  )
}