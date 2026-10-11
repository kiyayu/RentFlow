//src/features/settings/pages/SecurityPage.tsx
import { SessionsList } from '@/features/auth'
import { useTranslation } from '@/lib/i18n'
import { SettingsSection } from '../SettingsSection'

export default function SecurityPage() {
  const { t } = useTranslation('settings')
  return (
    <SettingsSection title={t('security.title')} description={t('security.description')}>
      <SessionsList />
    </SettingsSection>
  )
}