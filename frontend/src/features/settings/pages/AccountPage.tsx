//src/features/settings/pages/AccountPage.tsx
import { ChangePasswordForm } from "@/features/auth"
import { ChangeEmailForm } from "@/features/user"
import { SettingsSection } from "../SettingsSection"

export default function AccountPage() {
  return (
    <div className="space-y-6">
      <SettingsSection title="Email" description="The address you sign in with.">
        <ChangeEmailForm />
      </SettingsSection>
      <SettingsSection title="Password" description="Use a password you have not used elsewhere.">
        <ChangePasswordForm />
      </SettingsSection>
    </div>
  )
}