//src/features/settings/settings.config.ts
import { User, SlidersHorizontal, Bell, KeyRound, ShieldCheck, Lock, type LucideIcon } from 'lucide-react'
import type { ParseKeys } from 'i18next'
import { paths } from '@/config/paths'

type Key = ParseKeys<'settings'>
export type SettingsItem = { labelKey: Key; to: string; icon: LucideIcon; roles?: string[] }
export type SettingsGroup = { labelKey: Key; items: SettingsItem[] }

export const settingsConfig: {
  defaultPath: string
  groups: SettingsGroup[]
} = {
  defaultPath: paths.settings.profile,
  groups: [
    {
      labelKey: 'groups.personal',
      items: [
        { labelKey: 'nav.profile', to: paths.settings.profile, icon: User },
        { labelKey: 'nav.preferences', to: paths.settings.preferences, icon: SlidersHorizontal },
        { labelKey: 'nav.notifications', to: paths.settings.notifications, icon: Bell },
      ],
    },
    {
      labelKey: 'groups.account',
      items: [
        { labelKey: 'nav.account', to: paths.settings.account, icon: KeyRound },
        { labelKey: 'nav.security', to: paths.settings.security, icon: ShieldCheck },
        { labelKey: 'nav.privacy', to: paths.settings.privacy, icon: Lock },
      ],
    },
  ],
}

export const visibleGroups = (role?: string): SettingsGroup[] =>
  settingsConfig.groups
    .map((g) => ({ ...g, items: g.items.filter((i) => !i.roles || (role && i.roles.includes(role))) }))
    .filter((g) => g.items.length > 0)