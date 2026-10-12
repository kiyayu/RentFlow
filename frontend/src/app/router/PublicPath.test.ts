//src/app/router/PublicPath.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { QueryClient } from '@tanstack/react-query'
import { sessionQueryOptions } from '@/features/auth'
import { authApi } from '@/features/auth/api/auth.api'
import { createAuthGuard } from './PublicPath'

const user = { id: '1', name: 'T', email: 'a@b.com', emailVerified: true, role: 'customer', createdAt: '' }
const req = (path: string) => ({ request: new Request(`http://localhost${path}`) })

describe('createAuthGuard (logged-out pages only)', () => {
  let queryClient: QueryClient
  let guard: ReturnType<typeof createAuthGuard>

  beforeEach(() => {
    vi.restoreAllMocks()
    queryClient = new QueryClient()
    guard = createAuthGuard(queryClient)
  })

  it('redirects a cached user to the dashboard', async () => {
    queryClient.setQueryData(sessionQueryOptions.queryKey, user)

    const result = (await guard(req('/login'))) as Response
    expect(result.headers.get('Location')).toBe('/app/dashboard')
  })

  it('honors a safe ?redirect= for a cached user', async () => {
    queryClient.setQueryData(sessionQueryOptions.queryKey, user)

    const result = (await guard(req('/login?redirect=/app/note'))) as Response
    expect(result.headers.get('Location')).toBe('/app/note')
  })

  it('ignores an unsafe ?redirect=', async () => {
    queryClient.setQueryData(sessionQueryOptions.queryKey, user)

    const result = (await guard(req('/login?redirect=https://evil.com'))) as Response
    expect(result.headers.get('Location')).toBe('/app/dashboard')
  })

  it('lets a cached null (logged out) see the page', async () => {
    queryClient.setQueryData(sessionQueryOptions.queryKey, null)

    await expect(guard(req('/login'))).resolves.toBeNull()
  })

  it('asks the server when the cache is empty, then redirects a logged-in user', async () => {
    vi.spyOn(authApi, 'getProfile').mockResolvedValue(user)

    const result = (await guard(req('/login'))) as Response
    expect(result.headers.get('Location')).toBe('/app/dashboard')
  })

  it('shows the page when the server is unreachable', async () => {
    vi.spyOn(authApi, 'getProfile').mockRejectedValue(new Error('network down'))

    await expect(guard(req('/login'))).resolves.toBeNull()
  })
})