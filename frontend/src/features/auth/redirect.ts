//src/features/auth/redirect.ts
import { paths } from '@/config/paths'

// Only allow in-app targets. Anything else (other sites, //evil.com) falls back.
export function getSafeRedirect(target: string | null): string {
  if (target?.startsWith(`${paths.app.root}/`)) return target
  return paths.app.dashboard
}