//src/lib/format.ts
import { i18n } from '@/lib/i18n'

 
export const formatDateTime = (iso?: string): string =>
  iso
    ? new Intl.DateTimeFormat(i18n.language, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso))
    : '—'