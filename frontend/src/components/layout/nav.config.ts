//src/components/layout/nav.config.ts
import {
  LayoutDashboard,   User, Settings, type LucideIcon,
} from "lucide-react"
import { paths } from "@/config/paths"
import { site } from "@/config/site"

export type NavItem = { label: string; to: string; icon: LucideIcon }
export type LayoutVariant = "sidebar" | "topnav"

export const appConfig = {
  brand: site.name,
  layout: "sidebar" as LayoutVariant,
  nav: [
    { label: "Dashboard", to: paths.app.dashboard, icon: LayoutDashboard },
     
  ] satisfies NavItem[],
  account: [
    { label: "Profile", to: paths.settings.profile, icon: User },
    { label: "Settings", to: paths.settings.root, icon: Settings },
  ] satisfies NavItem[],
}