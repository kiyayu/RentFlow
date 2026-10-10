//src/features/settings/pages/ProfilePage.tsx
import { UpdateNameForm, AvatarUploader } from "@/features/user"
import { SettingsSection } from "../SettingsSection"

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <SettingsSection title="Photo" description="PNG, JPEG or WebP, up to 2 MB.">
        <AvatarUploader />
      </SettingsSection>
      <SettingsSection title="Profile" description="Your name as shown in the app.">
        <UpdateNameForm />
      </SettingsSection>
    </div>
  )
}