//src/features/settings/SettingsNav.tsx
import { NavLink } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { cn } from "@/lib/utils"
import { sessionQueryOptions } from '@/features/auth'
import { visibleGroups } from "./settings.config"

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "flex shrink-0 items-center gap-2 h-11 px-3 text-sm font-medium whitespace-nowrap rounded-lg transition-colors",
    isActive
      ? "bg-primary/10 text-primary"
      : "text-muted-foreground hover:bg-muted hover:text-foreground"
  )

export function SettingsNav() {
  const { data: user } = useQuery(sessionQueryOptions)
  const groups = visibleGroups(user?.role)

  return (
    <nav
      aria-label="Settings sections"
      className="flex gap-4 overflow-x-auto lg:flex-col lg:gap-6 lg:overflow-visible"
    >
      {groups.map((group) => (
        <div key={group.label} className="flex gap-1 lg:flex-col">
          <p className="hidden px-3 pb-1 text-xs font-medium text-muted-foreground lg:block">
            {group.label}
          </p>
          {group.items.map(({ label, to, icon: Icon }) => (
            <NavLink key={to} to={to} className={linkClass}>
              <Icon className="size-4" />
              {label}
            </NavLink>
          ))}
        </div>
      ))}
    </nav>
  )
}