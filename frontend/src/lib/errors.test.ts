//src/lib/errors.test.ts
import { describe, it, expect } from 'vitest'
import { AxiosError, type AxiosResponse } from 'axios'
import { getErrorMessage } from './errors'

const axiosError = (response?: Partial<AxiosResponse>) => {
  const e = new AxiosError('fail')
  e.response = response as AxiosResponse | undefined
  return e
}

describe('getErrorMessage', () => {
  it('reads the backend message', () => {
    const e = axiosError({ status: 400, data: { message: 'Code expired' } })
    expect(getErrorMessage(e)).toBe('Code expired')
  })
  it('reports an unreachable server', () => {
    expect(getErrorMessage(axiosError(undefined))).toMatch(/cannot reach the server/i)
  })
  it('uses the fallback for unknown errors', () => {
    expect(getErrorMessage(new Error('x'), 'Fallback')).toBe('Fallback')
  })
  it('uses the fallback when the body has no message', () => {
    expect(getErrorMessage(axiosError({ status: 500, data: {} }), 'Fallback')).toBe('Fallback')
  })
})