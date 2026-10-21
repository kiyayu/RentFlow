import { Boxes, CalendarDays, LayoutDashboard, PackagePlus, type LucideIcon, Users } from 'lucide-react'
import type { ParseKeys } from 'i18next'
import { paths } from '@/config/paths'
import { site } from '@/config/site'

export type WorkspaceNavItem = { labelKey: ParseKeys<'layout'>; to: string; icon: LucideIcon }
export type WorkspaceConfig = { brand: string; layout: 'sidebar' | 'topnav'; nav: WorkspaceNavItem[]; account: WorkspaceNavItem[] }

const account = [
  { labelKey: 'account.profile', to: paths.settings.profile, icon: Users },
  { labelKey: 'account.settings', to: paths.settings.root, icon: Users },
] satisfies WorkspaceNavItem[]

export const staffWorkspaceConfig: WorkspaceConfig = {
  brand: site.name,
  layout: 'sidebar',
  nav: [
    { labelKey: 'nav.dashboard', to: paths.app.dashboard, icon: LayoutDashboard },
    { labelKey: 'nav.equipment', to: paths.app.products, icon: PackagePlus },
    { labelKey: 'nav.inventory', to: paths.app.inventory, icon: Boxes },
    { labelKey: 'nav.reservations', to: paths.app.reservations, icon: CalendarDays },
  ],
  account,
}

export const adminWorkspaceConfig: WorkspaceConfig = {
  ...staffWorkspaceConfig,
}

export const customerWorkspaceConfig: WorkspaceConfig = {
  brand: site.name,
  layout: 'sidebar',
  nav: [
    { labelKey: 'nav.dashboard', to: paths.app.dashboard, icon: LayoutDashboard },
    { labelKey: 'nav.equipment', to: paths.app.equipment, icon: PackagePlus },
    { labelKey: 'nav.reservations', to: paths.app.reservations, icon: CalendarDays },
  ],
  account,
}
