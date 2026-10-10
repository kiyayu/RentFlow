//src/features/settings/pages/SecurityPage.tsx
import { SessionsList } from '@/features/auth'
import { SettingsSection } from '../SettingsSection'

export default function SecurityPage() {
  return (
    <SettingsSection title="Security" description="Devices signed in to your account.">
      <SessionsList />
    </SettingsSection>
  )
}