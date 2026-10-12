//src/features/auth/auth-session.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { AxiosError, type AxiosResponse } from 'axios'

vi.mock('@/lib/axios', () => ({
  api: {},
  API_BASE_URL: 'http://localhost/api/',
  refreshToken: vi.fn(),
  onSessionExpired: vi.fn(),
}))

import { refreshToken } from '@/lib/axios'
import { authApi } from './api/auth.api'
import { sessionQueryOptions } from './auth-session'
import type { SessionUser } from './types/auth.types'

const user: SessionUser = {
  id: '1', name: 'Test', email: 'a@b.com', emailVerified: true, role: 'customer', createdAt: '',
}

const httpError = (status: number) =>
  new AxiosError('fail', undefined, undefined, undefined, { status } as AxiosResponse)

const run = () => (sessionQueryOptions.queryFn as () => Promise<SessionUser | null>)()
const refresh = vi.mocked(refreshToken)

describe('fetchSession', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    refresh.mockReset()
  })

  it('returns the user when the profile loads', async () => {
    vi.spyOn(authApi, 'getProfile').mockResolvedValue(user)

    await expect(run()).resolves.toEqual(user)
    expect(refresh).not.toHaveBeenCalled()
  })

  it('refreshes after a 401 and returns the user', async () => {
    vi.spyOn(authApi, 'getProfile')
      .mockRejectedValueOnce(httpError(401))
      .mockResolvedValueOnce(user)
    refresh.mockResolvedValue(undefined)

    await expect(run()).resolves.toEqual(user)
    expect(refresh).toHaveBeenCalledOnce()
  })

  it('returns null (a real answer: nobody logged in) when the refresh is also 401', async () => {
    vi.spyOn(authApi, 'getProfile').mockRejectedValue(httpError(401))
    refresh.mockRejectedValue(httpError(401))

    await expect(run()).resolves.toBeNull()
  })

  it('throws on a server error, so the cache stays empty', async () => {
    vi.spyOn(authApi, 'getProfile').mockRejectedValue(httpError(500))

    await expect(run()).rejects.toBeTruthy()
    expect(refresh).not.toHaveBeenCalled()
  })

  it('throws when the refresh endpoint itself fails with a server error', async () => {
    vi.spyOn(authApi, 'getProfile').mockRejectedValue(httpError(401))
    refresh.mockRejectedValue(httpError(500))

    await expect(run()).rejects.toBeTruthy()
  })
})