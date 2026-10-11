//src/features/settings/pages/ProfilePage.tsx
import { UpdateNameForm, AvatarUploader } from '@/features/user'
import { useTranslation } from '@/lib/i18n'
import { SettingsSection } from '../SettingsSection'

export default function ProfilePage() {
  const { t } = useTranslation('settings')
  return (
    <div className="space-y-6">
      <SettingsSection title={t('profile.photoTitle')} description={t('profile.photoDescription')}>
        <AvatarUploader />
      </SettingsSection>
      <SettingsSection title={t('profile.title')} description={t('profile.description')}>
        <UpdateNameForm />
      </SettingsSection>
    </div>
  )
}