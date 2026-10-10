// src/lib/react-query.ts
import { AxiosError } from 'axios'
import { queryOptions } from '@tanstack/react-query'
import { api, refreshToken } from './axios'

export { queryClient } from './query.client'

export type SessionUser = {
  id: string
  name: string
  email: string
  role: string
}

async function getProfile() {
  const response = await api.get<{ data?: SessionUser }>('/user/profile')
  const user = response.data?.data
  if (!user?.id) throw new Error('The profile endpoint returned invalid data')
  return user
}

async function fetchSession() {
  try {
    return await getProfile()
  } catch (error) {
    if (!(error instanceof AxiosError) || error.response?.status !== 401) {
      throw error
    }
  }

  try {
    await refreshToken()
    return await getProfile()
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 401) return null
    throw error
  }
}

export const sessionQueryOptions = queryOptions({
  queryKey: ['session'] as const,
  queryFn: fetchSession,
  staleTime: Infinity,
  gcTime: Infinity,
  retry: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
})