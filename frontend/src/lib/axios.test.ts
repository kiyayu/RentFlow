//src/lib/axios.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { AxiosError, type AxiosAdapter, type AxiosResponse } from 'axios'
import { api, onSessionExpired } from './axios'

type Step = { status: number; delay?: number }

const calls: string[] = []
const routes = new Map<string, Step[]>()

// Fake network: each url has a queue of answers. No real request is ever sent.
const adapter: AxiosAdapter = async (config) => {
  const url = config.url ?? ''
  calls.push(url)
  const step = routes.get(url)?.shift() ?? { status: 200 }
  if (step.delay) await new Promise((r) => setTimeout(r, step.delay))

  const response = { data: {}, status: step.status, statusText: '', headers: {}, config } as AxiosResponse
  if (step.status >= 200 && step.status < 300) return response
  throw new AxiosError('fail', undefined, config, null, response)
}

const route = (url: string, ...steps: Step[]) => routes.set(url, steps)
const refreshCalls = () => calls.filter((u) => u === '/auth/refresh-token').length

describe('axios interceptor', () => {
  const expired = vi.fn()

  beforeEach(() => {
    calls.length = 0
    routes.clear()
    expired.mockReset()
    api.defaults.adapter = adapter
    onSessionExpired(expired)
  })

  it('refreshes once and retries the original request', async () => {
    route('/notes', { status: 401 }, { status: 200 })
    route('/auth/refresh-token', { status: 200 })

    const res = await api.get('/notes')

    expect(res.status).toBe(200)
    expect(calls).toEqual(['/notes', '/auth/refresh-token', '/notes'])
    expect(expired).not.toHaveBeenCalled()
  })

  it('expires the session when the refresh fails', async () => {
    route('/notes', { status: 401 })
    route('/auth/refresh-token', { status: 401 })

    await expect(api.get('/notes')).rejects.toMatchObject({ response: { status: 401 } })
    expect(expired).toHaveBeenCalledOnce()
  })

  it('does not loop: a second 401 after a good refresh just rejects', async () => {
    route('/notes', { status: 401 }, { status: 401 })
    route('/auth/refresh-token', { status: 200 })

    await expect(api.get('/notes')).rejects.toBeTruthy()
    expect(refreshCalls()).toBe(1)
    expect(expired).not.toHaveBeenCalled()
  })

  it.each([
    '/user/profile',
    '/auth/login',
    '/auth/register',
    '/auth/verify-otp',
    '/auth/resend-otp',
    '/auth/forgot-password',
    '/auth/reset-password',
  ])('never refreshes for %s (a 401 here is a user mistake)', async (url) => {
    route(url, { status: 401 })

    await expect(api.post(url)).rejects.toBeTruthy()
    expect(refreshCalls()).toBe(0)
    expect(expired).not.toHaveBeenCalled()
  })

  it('does not refresh for non-401 errors', async () => {
    route('/notes', { status: 500 })

    await expect(api.get('/notes')).rejects.toBeTruthy()
    expect(refreshCalls()).toBe(0)
  })

  it('shares one refresh between simultaneous 401s', async () => {
    route('/a', { status: 401 }, { status: 200 })
    route('/b', { status: 401 }, { status: 200 })
    route('/auth/refresh-token', { status: 200, delay: 20 })

    await Promise.all([api.get('/a'), api.get('/b')])

    expect(refreshCalls()).toBe(1)
  })
})