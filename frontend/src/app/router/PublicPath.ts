//src/app/router/PublicPath.ts
import { redirect, type RouteObject } from 'react-router-dom'
import type { QueryClient } from '@tanstack/react-query'
import { sessionQueryOptions, getSafeRedirect } from '@/features/auth'
import { paths } from '@/config/paths'

const page = (load: () => Promise<{ default: React.ComponentType }>) => () =>
  load().then((m) => ({ Component: m.default }))

// Marketing: open to everyone, including logged-in users (they may read the Terms).
export const marketingRoutes: RouteObject[] = [
  { index: true, lazy: page(() => import('@/features/marketing/pages/HomePage')) },
  { path: 'contact', handle: { title: 'Contact' }, lazy: page(() => import('@/features/marketing/pages/ContactPage')) },
  { path: 'terms', handle: { title: 'Terms of Service' }, lazy: page(() => import('@/features/marketing/pages/TermsPage')) },
  { path: 'privacy', handle: { title: 'Privacy Policy' }, lazy: page(() => import('@/features/marketing/pages/PrivacyPage')) },
  { path: 'price', handle: { title: 'Pricing' }, lazy: page(() => import('@/features/marketing/pages/PricePage')) },
  { path: 'products', handle: { title: 'Equipment' }, lazy: page(() => import('@/features/product/pages/ProductCatalogPage')) },
  { path: 'products/:slug', handle: { title: 'Equipment' }, lazy: page(() => import('@/features/product/pages/ProductDetailPage')) },
  { path: 'products/:slug/reserve', handle: { title: 'Reserve equipment' }, lazy: page(() => import('@/features/reservation/pages/ReservationPage')) },
]

// Auth: only for logged-out users. The guard sits on the group, not on each page.
export const authRoutes: RouteObject[] = [
  { path: 'login', handle: { title: 'Log in' }, lazy: page(() => import('@/features/auth/pages/LoginPage')) },
  { path: 'register', handle: { title: 'Create account' }, lazy: page(() => import('@/features/auth/pages/RegisterPage')) },
  { path: 'verify-email', handle: { title: 'Verify email' }, lazy: page(() => import('@/features/auth/pages/VerifyEmailPage')) },
  { path: 'forgot-password', handle: { title: 'Forgot password' }, lazy: page(() => import('@/features/auth/pages/ForgotPasswordPage')) },
  { path: 'reset-password', handle: { title: 'Reset password' }, lazy: page(() => import('@/features/auth/pages/ResetPasswordPage')) },
]

// Request → the ?redirect= value → a safe in-app path
const redirectTarget = (request: Request) =>
  getSafeRedirect(new URL(request.url).searchParams.get('redirect'))

export function createAuthGuard(queryClient: QueryClient) {
  return async ({ request }: { request: Request }) => {
    const cached = queryClient.getQueryData(sessionQueryOptions.queryKey)

    if (cached !== undefined) {
      return cached ? redirect(redirectTarget(request)) : null
    }

    try {
      const user = await queryClient.ensureQueryData(sessionQueryOptions)
      if (user) return redirect(redirectTarget(request))
    } catch {
      // server unreachable → treat as logged out, show the page
    }

    return null
  }
}

export function createHomeGuard(queryClient: QueryClient) {
  return async () => {
    const cached = queryClient.getQueryData(sessionQueryOptions.queryKey)

    if (cached !== undefined) {
      return cached ? redirect(paths.app.dashboard) : null
    }

    try {
      const user = await queryClient.ensureQueryData(sessionQueryOptions)
      if (user) return redirect(paths.app.dashboard)
    } catch {
      return null
    }

    return null
  }
}
