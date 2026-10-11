//src/features/settings/SettingsLayout.tsx
import { Outlet } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/layout/PageHeader'
import { useTranslation } from '@/lib/i18n'
import { SettingsNav } from './SettingsNav'

export default function SettingsLayout() {
  const { t } = useTranslation('settings')

  return (
    <PageContainer>
      <PageHeader title={t('title')} description={t('description')} />
      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="lg:w-56 lg:shrink-0">
          <SettingsNav />
        </aside>
        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </div>
    </PageContainer>
  )
}