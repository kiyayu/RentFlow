//src/features/auth/auth-session.ts
import { AxiosError } from 'axios'
import { queryOptions } from '@tanstack/react-query'
import { refreshToken } from '@/lib/axios'
import { authApi } from './api/auth.api'
import type { SessionUser } from './types/auth.types'

export const authKeys = {
  session: ['session'] as const,
  sessions: ['auth', 'sessions'] as const,
}

const isUnauthorized = (error: unknown) =>
  error instanceof AxiosError && error.response?.status === 401

// Returns the user, null (nobody logged in), or THROWS (server/network problem).
async function fetchSession(): Promise<SessionUser | null> {
  try {
    return await authApi.getProfile()
  } catch (error) {
    if (!isUnauthorized(error)) throw error
  }

  try {
    await refreshToken()
    return await authApi.getProfile()
  } catch (error) {
    if (isUnauthorized(error)) return null
    throw error
  }
}

export const sessionQueryOptions = queryOptions({
  queryKey: authKeys.session,
  queryFn: fetchSession,
  staleTime: Infinity,
  gcTime: Infinity,
  retry: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
})