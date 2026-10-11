//src/components/layout/nav.config.ts
import {
  LayoutDashboard,   User, Settings, type LucideIcon,
} from 'lucide-react'
import type { ParseKeys } from 'i18next'
import { paths } from '@/config/paths'
import { site } from '@/config/site'

export type NavItem = { labelKey: ParseKeys<'layout'>; to: string; icon: LucideIcon }
export type LayoutVariant = 'sidebar' | 'topnav'

export const appConfig = {
  brand: site.name,
  layout: 'sidebar' as LayoutVariant,
  nav: [
    { labelKey: 'nav.dashboard', to: paths.app.dashboard, icon: LayoutDashboard },
  
  ] satisfies NavItem[],
  account: [
    { labelKey: 'account.profile', to: paths.settings.profile, icon: User },
    { labelKey: 'account.settings', to: paths.settings.root, icon: Settings },
  ] satisfies NavItem[],
}