//src/lib/errors.ts
import { isAxiosError } from 'axios'

export function getErrorMessage(
  error: unknown,
  fallback = 'Something went wrong. Please try again.'
): string {
  if (isAxiosError(error)) {
    if (!error.response) return 'Cannot reach the server. Check your connection.'
    const message = error.response.data?.message
    if (typeof message === 'string' && message) return message
  }
  return fallback
}