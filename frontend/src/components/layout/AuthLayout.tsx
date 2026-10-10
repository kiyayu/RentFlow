//src/components/layout/AuthLayout.tsx
import { Link, Outlet } from "react-router-dom"
import { paths } from "@/config/paths"
import { site, legalLinks } from "@/config/site"

export function AuthLayout() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <header className="flex items-center h-14 px-4 md:px-6">
        <Link to={paths.home} className="text-base font-semibold text-foreground">
          {site.name}
        </Link>
      </header>

      <main className="flex items-center justify-center flex-1 p-4">
        <div className="w-full max-w-sm p-6 space-y-6 bg-card border border-border rounded-xl shadow-sm">
          <Outlet />
        </div>
      </main>

      <footer className="flex items-center justify-center gap-4 px-4 py-4 text-xs text-muted-foreground">
        {legalLinks.map(({ label, to }) => (
          <Link key={to} to={to} className="transition-colors hover:text-foreground">
            {label}
          </Link>
        ))}
      </footer>
    </div>
  )
}