//src/features/settings/pages/PreferencesPage.tsx
import { ThemeSelector } from "@/features/preferences"
import { SettingsSection } from "../SettingsSection"

export default function PreferencesPage() {
  return (
    <SettingsSection title="Appearance" description="Choose how the app looks on this device.">
      <ThemeSelector />
    </SettingsSection>
  )
}