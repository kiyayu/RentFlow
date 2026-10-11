//src/components/layout/NavList.tsx
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'
import { appConfig } from './nav.config'

type Orientation = 'vertical' | 'horizontal'

const linkClass =
  (orientation: Orientation) =>
  ({ isActive }: { isActive: boolean }) =>
    cn(
      'flex items-center gap-2 px-3 text-sm font-medium whitespace-nowrap rounded-lg transition-colors',
      orientation === 'vertical' ? 'h-11' : 'h-9',
      isActive
        ? 'bg-primary/10 text-primary'
        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
    )

export function NavList({
  orientation = 'vertical',
  className,
  onNavigate,
}: {
  orientation?: Orientation
  className?: string
  onNavigate?: () => void
}) {
  const { t } = useTranslation('layout')

  return (
    <nav
      aria-label={t('shell.mainNavigation')}
      className={cn(
        orientation === 'vertical' ? 'space-y-1' : 'flex items-center gap-1',
        className
      )}
    >
      {appConfig.nav.map(({ labelKey, to, icon: Icon }) => (
        <NavLink key={to} to={to} className={linkClass(orientation)} onClick={onNavigate}>
          <Icon className="size-4" />
          {t(labelKey)}
        </NavLink>
      ))}
    </nav>
  )
}