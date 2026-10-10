//src/features/auth/redirect.test.ts
import { describe, it, expect } from 'vitest'
import { getSafeRedirect } from './redirect'

describe('getSafeRedirect', () => {
  it('allows in-app paths', () => {
    expect(getSafeRedirect('/app/note')).toBe('/app/note')
  })
  it('falls back for null', () => {
    expect(getSafeRedirect(null)).toBe('/app/dashboard')
  })
  it.each(['https://evil.com', '//evil.com', '/login', '/app', 'javascript:alert(1)'])(
    'rejects %s',
    (target) => {
      expect(getSafeRedirect(target)).toBe('/app/dashboard')
    }
  )
})