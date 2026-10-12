//src/features/auth/hooks/useLogin.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { authApi } from '../api/auth.api'
import { authKeys } from '../auth-session'
import { useLogin } from './useLogin'

const user = { id: '1', name: 'T', email: 'a@b.com', emailVerified: true, role: 'customer', createdAt: '' }

const setup = () => {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } })
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  return { queryClient, ...renderHook(() => useLogin(), { wrapper }) }
}

describe('useLogin', () => {
  it('writes the returned user into the session cache', async () => {
    vi.spyOn(authApi, 'login').mockResolvedValue(user)
    const { queryClient, result } = setup()

    await act(() => result.current.mutateAsync({ email: 'a@b.com', password: 'x' }))

    expect(queryClient.getQueryData(authKeys.session)).toEqual(user)
  })

  it('leaves the session cache untouched when login fails', async () => {
    vi.spyOn(authApi, 'login').mockRejectedValue(new Error('bad credentials'))
    const { queryClient, result } = setup()

    await act(async () => {
      await result.current.mutateAsync({ email: 'a@b.com', password: 'x' }).catch(() => {})
    })

    expect(queryClient.getQueryData(authKeys.session)).toBeUndefined()
  })
})