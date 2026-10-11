//src/features/settings/pages/NotificationsPage.tsx
import { NotificationList } from '@/features/notifications'
import { useTranslation } from '@/lib/i18n'
import { SettingsSection } from '../SettingsSection'

export default function NotificationsPage() {
  const { t } = useTranslation('notifications')
  return (
    <SettingsSection title={t('title')} description={t('description')}>
      <NotificationList />
    </SettingsSection>
  )
}