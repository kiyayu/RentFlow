//src/features/settings/pages/PrivacyPage.tsx
import { Link } from "react-router-dom"
import { DangerZone } from "@/features/user"
import { paths } from "@/config/paths"
import { SettingsSection } from "../SettingsSection"

export default function PrivacyPage() {
  return (
    <div className="space-y-6">
      <SettingsSection title="Your data" description="How we handle your information.">
        <p className="text-sm text-muted-foreground">
          Read the{" "}
          <Link to={paths.privacy} className="text-primary hover:underline">Privacy Policy</Link>{" "}
          for what we collect and why.
        </p>
      </SettingsSection>
      <SettingsSection title="Danger zone" description="Actions here affect your whole account.">
        <DangerZone />
      </SettingsSection>
    </div>
  )
}