//src/features/settings/pages/PrivacyPage.tsx
import { Link } from 'react-router-dom'
import { DangerZone } from '@/features/user'
import { paths } from '@/config/paths'
import { useTranslation } from '@/lib/i18n'
import { SettingsSection } from '../SettingsSection'

export default function PrivacyPage() {
  const { t } = useTranslation('settings')
  return (
    <div className="space-y-6">
      <SettingsSection title={t('privacy.dataTitle')} description={t('privacy.dataDescription')}>
        <p className="text-sm text-muted-foreground">
          {t('privacy.readThe')}{' '}
          <Link to={paths.privacy} className="text-primary hover:underline">
            {t('legal.privacy', { ns: 'layout' })}
          </Link>{' '}
          {t('privacy.forWhat')}
        </p>
      </SettingsSection>
      <SettingsSection title={t('privacy.dangerTitle')} description={t('privacy.dangerDescription')}>
        <DangerZone />
      </SettingsSection>
    </div>
  )
}