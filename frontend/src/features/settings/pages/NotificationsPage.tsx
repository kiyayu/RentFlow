//src/features/settings/pages/NotificationsPage.tsx
import { NotificationList } from '@/features/notifications'
import { SettingsSection } from '../SettingsSection'

export default function NotificationsPage() {
  return (
    <SettingsSection title="Notifications" description="Security alerts about your account.">
      <NotificationList />
    </SettingsSection>
  )
}