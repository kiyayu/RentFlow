//src/components/layout/AppShell.tsx
import { Link, Outlet } from 'react-router-dom'
import { Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'
import { site, legalLinks } from '@/config/site'
import { useLayoutStore } from '@/store/layout.ui.store'
import { NavList } from './NavList'
import { MobileSidebar } from './MobileSidebar'
import { Topbar, type ShellUser } from './Topbar'
import { appConfig } from './nav.config'

export function AppShell({
  user,
  onLogout,
  notifications,
}: {
  user?: ShellUser
  onLogout?: () => void
  notifications?: React.ReactNode
}) {
  const { t } = useTranslation('layout')
  const isSidebar = appConfig.layout === 'sidebar'

  const openSidebar = useLayoutStore((s) => s.openSidebar)
  const collapsed = useLayoutStore((s) => s.sidebarCollapsed)
  const collapseSidebar = useLayoutStore((s) => s.collapseSidebar)
  const expandSidebar = useLayoutStore((s) => s.expandSidebar)

  return (
    <div className="flex flex-col h-dvh bg-background">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:px-3 focus:py-2 focus:bg-card focus:text-foreground focus:border focus:border-border focus:rounded-lg"
      >
        {t('shell.skipToContent')}
      </a>

      <header className="flex items-center gap-2 h-14 px-4 shrink-0 bg-card border-b border-border md:px-6">
        {/* below lg (both variants): opens the drawer */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label={t('shell.openMenu')}
          onClick={openSidebar}
          icon={<Menu />}
        />

        {/* lg and up, sidebar variant only: collapse / expand */}
        {isSidebar && (
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:inline-flex"
            aria-label={collapsed ? t('shell.showSidebar') : t('shell.hideSidebar')}
            onClick={collapsed ? expandSidebar : collapseSidebar}
            icon={collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
          />
        )}

        <span className="text-base font-semibold text-foreground">{appConfig.brand}</span>

        {/* lg and up, topnav variant only: links live in the navbar */}
        {!isSidebar && <NavList orientation="horizontal" className="hidden ml-4 lg:flex" />}

        <Topbar user={user} onLogout={onLogout} notifications={notifications} />
      </header>

      <div className="flex flex-1 min-h-0">
        {isSidebar && (
          <aside
            className={cn(
              'hidden shrink-0 overflow-hidden bg-card border-border transition-[width] duration-200 lg:block',
              collapsed ? 'w-0 border-r-0' : 'w-56 border-r'
            )}
          >
            <div className="w-56 p-4">
              <NavList />
            </div>
          </aside>
        )}

        <div className="flex flex-col flex-1 min-w-0 overflow-y-auto">
          <main id="main" tabIndex={-1} className="flex-1 outline-none">
            <Outlet />
          </main>
          <footer className="flex flex-col gap-2 px-4 py-4 text-xs text-muted-foreground bg-card border-t border-border sm:flex-row sm:items-center sm:justify-between md:px-6">
            <span>{t('footer.copyright', { year: new Date().getFullYear(), name: site.name })}</span>
            <nav aria-label={t('shell.legalNavigation')} className="flex gap-4">
              {legalLinks.map(({ labelKey, to }) => (
                <Link key={to} to={to} className="transition-colors hover:text-foreground">
                  {t(labelKey)}
                </Link>
              ))}
            </nav>
          </footer>
        </div>
      </div>

      <MobileSidebar />
    </div>
  )
}