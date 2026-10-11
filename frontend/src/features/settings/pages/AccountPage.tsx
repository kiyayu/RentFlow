//src/features/settings/pages/AccountPage.tsx
import { ChangePasswordForm } from '@/features/auth'
import { ChangeEmailForm } from '@/features/user'
import { useTranslation } from '@/lib/i18n'
import { SettingsSection } from '../SettingsSection'

export default function AccountPage() {
  const { t } = useTranslation('settings')
  return (
    <div className="space-y-6">
      <SettingsSection title={t('account.emailTitle')} description={t('account.emailDescription')}>
        <ChangeEmailForm />
      </SettingsSection>
      <SettingsSection title={t('account.passwordTitle')} description={t('account.passwordDescription')}>
        <ChangePasswordForm />
      </SettingsSection>
    </div>
  )
}