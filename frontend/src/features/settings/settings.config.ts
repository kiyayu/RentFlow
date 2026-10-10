//src/features/settings/settings.config.ts
import { User, SlidersHorizontal, Bell, KeyRound, ShieldCheck, Lock, type LucideIcon } from "lucide-react"
import { paths } from "@/config/paths"

export type SettingsItem = { label: string; to: string; icon: LucideIcon; roles?: string[] }
export type SettingsGroup = { label: string; items: SettingsItem[] }

export const settingsConfig:{
  title: string
  description: string
  defaultPath: string
  groups: SettingsGroup[]
}  = {
  title: "Settings",
  description: "Manage your profile, preferences and security.",
  defaultPath: paths.settings.profile,
  groups: [
    {
      label: "Personal",
      items: [
        { label: "Profile", to: paths.settings.profile, icon: User },
        { label: "Preferences", to: paths.settings.preferences, icon: SlidersHorizontal },
        { label: "Notifications", to: paths.settings.notifications, icon: Bell },
      ],
    },
    {
      label: "Account",
      items: [
        { label: "Account", to: paths.settings.account, icon: KeyRound },
        { label: "Security", to: paths.settings.security, icon: ShieldCheck },
        { label: "Privacy & data", to: paths.settings.privacy, icon: Lock },
      ],
    },
  ]  
}

export const visibleGroups = (role?: string): SettingsGroup[] =>
  settingsConfig.groups
    .map((g) => ({ ...g, items: g.items.filter((i) => !i.roles || (role && i.roles.includes(role))) }))
    .filter((g) => g.items.length > 0)