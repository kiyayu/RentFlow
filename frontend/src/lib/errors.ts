//src/lib/errors.ts
import { isAxiosError } from 'axios'
import { i18n } from '@/lib/i18n'

// Network and generic messages come from the errors namespace.
// Backend `message` strings are shown as received (English until the backend sends error codes).
export function getErrorMessage(error: unknown, fallback?: string): string {
  if (isAxiosError(error)) {
    if (!error.response) return i18n.t('errors:network')
    const message = error.response.data?.message
    if (typeof message === 'string' && message) return message
  }
  return fallback ?? i18n.t('errors:generic')
}