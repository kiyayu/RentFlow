//src/components/layout/MarketingLayout.tsx
import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'
import { paths } from '@/config/paths'
import { site } from '@/config/site'
import { publicConfig } from './public.config'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'flex items-center h-11 px-3 text-sm font-medium rounded-lg transition-colors lg:h-9',
    isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
  )

function MarketingNavbar() {
  const { t } = useTranslation(['layout', 'marketing'])
  const [open, setOpen] = useState(false)
  const { nav, cta } = publicConfig

  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border">
      <div className="flex items-center gap-2 h-14 w-full max-w-7xl mx-auto px-4 md:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label={t('shell.openMenu')}
          onClick={() => setOpen(true)}
          icon={<Menu />}
        />

        <Link to={paths.home} className="text-base font-semibold text-foreground">
          {site.name}
        </Link>

        <nav aria-label={t('shell.mainNavigation')} className="items-center hidden gap-1 ml-6 lg:flex">
          {nav.map(({ labelKey, to }) => (
            <NavLink key={to} to={to} end={to === paths.home} className={linkClass}>
              {t(labelKey)}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 ml-auto">
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link to={cta.login.to}>{t(cta.login.labelKey)}</Link>
          </Button>
          <Button asChild>
            <Link to={cta.register.to}>{t(cta.register.labelKey)}</Link>
          </Button>
        </div>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64 p-4 lg:hidden">
          <SheetHeader>
            <SheetTitle>{site.name}</SheetTitle>
          </SheetHeader>
          <nav aria-label={t('shell.mainNavigation')} className="space-y-1">
            {nav.map(({ labelKey, to }) => (
              <NavLink
                key={to}
                to={to}
                end={to === paths.home}
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                {t(labelKey)}
              </NavLink>
            ))}
            <NavLink to={cta.login.to} className={linkClass} onClick={() => setOpen(false)}>
              {t(cta.login.labelKey)}
            </NavLink>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  )
}

function MarketingFooter() {
  const { t } = useTranslation('layout')

  return (
    <footer className="bg-card border-t border-border">
      <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8 md:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 space-y-2">
            <p className="text-base font-semibold text-foreground">{site.name}</p>
            {/* tagline is marketing wording: it moves to a locale file in the marketing step */}
            <p className="max-w-xs text-sm text-muted-foreground">{t('marketing:tagline')}</p>
          </div>
          {publicConfig.footerColumns.map((column) => (
            <div key={column.titleKey} className="space-y-3">
              <p className="text-sm font-medium text-foreground">{t(column.titleKey)}</p>
              <ul className="space-y-2">
                {column.links.map(({ labelKey, to }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="text-sm transition-colors text-muted-foreground hover:text-foreground"
                    >
                      {t(labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="pt-6 text-xs text-muted-foreground border-t border-border">
          {t('footer.copyright', { year: new Date().getFullYear(), name: site.name })}
        </p>
      </div>
    </footer>
  )
}

export function MarketingLayout() {
  const { t } = useTranslation('layout')

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:px-3 focus:py-2 focus:bg-card focus:text-foreground focus:border focus:border-border focus:rounded-lg"
      >
        {t('shell.skipToContent')}
      </a>
      <MarketingNavbar />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <Outlet />
      </main>
      <MarketingFooter />
    </div>
  )
}