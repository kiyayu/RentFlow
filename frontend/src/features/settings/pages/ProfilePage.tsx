//src/features/settings/pages/ProfilePage.tsx
import { UpdateNameForm } from "@/features/user"
import { SettingsSection } from "../SettingsSection"

export default function ProfilePage() {
  return (
    <SettingsSection title="Profile" description="Your name as shown in the app.">
      <UpdateNameForm />
    </SettingsSection>
  )
}