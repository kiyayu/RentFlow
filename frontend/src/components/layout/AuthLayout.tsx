//src/components/layout/AuthLayout.tsx
import { Link, Outlet } from 'react-router-dom'
import { paths } from '@/config/paths'
import { site, legalLinks } from '@/config/site'
import { useTranslation } from '@/lib/i18n'

export function AuthLayout() {
  const { t } = useTranslation('layout')

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:px-3 focus:py-2 focus:bg-card focus:text-foreground focus:border focus:border-border focus:rounded-lg"
      >
        {t('shell.skipToContent')}
      </a>

      <header className="flex items-center h-14 px-4 md:px-6">
        <Link to={paths.home} className="text-base font-semibold text-foreground">
          {site.name}
        </Link>
      </header>

      <main id="main" tabIndex={-1} className="flex items-center justify-center flex-1 p-4 outline-none">
        <div className="w-full max-w-sm p-6 space-y-6 bg-card border border-border rounded-xl shadow-sm">
          <Outlet />
        </div>
      </main>

      <footer className="flex items-center justify-center gap-4 px-4 py-4 text-xs text-muted-foreground">
        {legalLinks.map(({ labelKey, to }) => (
          <Link key={to} to={to} className="transition-colors hover:text-foreground">
            {t(labelKey)}
          </Link>
        ))}
      </footer>
    </div>
  )
}