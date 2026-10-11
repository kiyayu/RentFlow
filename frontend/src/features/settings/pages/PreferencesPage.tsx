//src/features/settings/pages/PreferencesPage.tsx
import { ThemeSelector } from '@/features/preferences'
import { useTranslation } from '@/lib/i18n'
import { SettingsSection } from '../SettingsSection'

export default function PreferencesPage() {
  const { t } = useTranslation('settings')
  return (
    <SettingsSection title={t('preferences.title')} description={t('preferences.description')}>
      <ThemeSelector />
    </SettingsSection>
  )
}