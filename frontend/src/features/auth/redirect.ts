//src/features/auth/redirect.ts
import { paths } from '@/config/paths'

 
export function getSafeRedirect(target: string | null): string {
  if (target?.startsWith(`${paths.app.root}/`)) return target
  return paths.app.dashboard
}