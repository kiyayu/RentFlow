//src/features/settings/pages/PreferencesPage.tsx
import { LanguageSelector, ThemeSelector } from '@/features/preferences'
import { useTranslation } from '@/lib/i18n'
import { SettingsSection } from '../SettingsSection'

export default function PreferencesPage() {
  const { t } = useTranslation('settings')
  return (
    <div className="space-y-6">
      <SettingsSection title={t('preferences.title')} description={t('preferences.description')}>
        <ThemeSelector />
      </SettingsSection>
      <SettingsSection title={t('preferences.languageTitle')} description={t('preferences.languageDescription')}>
        <LanguageSelector />
      </SettingsSection>
    </div>
  )
}
