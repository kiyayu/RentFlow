//src/features/auth/session-expiry.ts
import { queryClient } from '@/lib/query.client'
import { onSessionExpired } from '@/lib/axios'
import { paths } from '@/config/paths'
import { authKeys } from './auth-session'

type ClearOptions = { returnToCurrentPage: boolean }

// 1. memory: session = null, delete every other cached drawer (no data leaks to the next user)
// 2. full reload to /login, which also wipes the in-memory cache
export function clearSession({ returnToCurrentPage }: ClearOptions) {
  queryClient.setQueryData(authKeys.session, null)
  queryClient.removeQueries({
    predicate: (query) => query.queryKey[0] !== authKeys.session[0],
  })

  if (window.location.pathname === paths.login) return

  const target = returnToCurrentPage
    ? `${paths.login}?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`
    : paths.login

  window.location.replace(target)
}

// Called once at startup (main.tsx).
export function registerSessionExpiry() {
  onSessionExpired(() => clearSession({ returnToCurrentPage: true }))
}
export function registerBfcacheGuard() {
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) window.location.reload()
  })
}