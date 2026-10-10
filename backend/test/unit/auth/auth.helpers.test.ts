// test/unit/auth/auth.helpers.test.ts
import { describe, it, expect } from 'vitest'
import { sha256, safeEqualHex, issueOtp, issueOpaqueToken } from '../../../src/modules/auth/auth.helpers.js'

describe('sha256', () => {
  it('produces the same hash for the same input, every time', () => {
    const hash1 = sha256('hello')
    const hash2 = sha256('hello')
    expect(hash1).toBe(hash2)
  })

  it('produces a different hash for a different input', () => {
    const hash1 = sha256('hello')
    const hash2 = sha256('goodbye')
    expect(hash1).not.toBe(hash2)
  })

  it('always outputs a 64-character hex string (sha256 fingerprint length)', () => {
    const hash = sha256('anything')
    expect(hash).toHaveLength(64)
    expect(hash).toMatch(/^[0-9a-f]+$/)
  })
})

describe('safeEqualHex', () => {
  it('returns true for two identical hashes', () => {
    const hash = sha256('secret')
    expect(safeEqualHex(hash, hash)).toBe(true)
  })

  it('returns false for two different hashes', () => {
    const hash1 = sha256('secret')
    const hash2 = sha256('different')
    expect(safeEqualHex(hash1, hash2)).toBe(false)
  })

  it('returns false when either value is missing', () => {
    expect(safeEqualHex(undefined, 'somehash')).toBe(false)
    expect(safeEqualHex('somehash', undefined)).toBe(false)
    expect(safeEqualHex(null, null)).toBe(false)
  })
})

describe('issueOtp', () => {
  it('generates a 6-digit numeric code', () => {
    const otp = issueOtp()
    expect(otp.code).toMatch(/^\d{6}$/)
  })

  it('hash does not equal the raw code (never store plaintext)', () => {
    const otp = issueOtp()
    expect(otp.hash).not.toBe(otp.code)
  })

  it('hash matches what sha256 would produce for that code', () => {
    const otp = issueOtp()
    expect(otp.hash).toBe(sha256(otp.code))
  })

  it('sets an expiry roughly ttlMs in the future', () => {
    const ttl = 5 * 60 * 1000
    const before = Date.now()
    const otp = issueOtp()
    const expectedExpiry = before + ttl
    // allow a small margin for test execution time
    expect(otp.expiry.getTime()).toBeGreaterThanOrEqual(expectedExpiry - 100)
    expect(otp.expiry.getTime()).toBeLessThanOrEqual(expectedExpiry + 1000)
  })
})

describe('issueOpaqueToken', () => {
  it('generates two different tokens on separate calls', () => {
    const token1 = issueOpaqueToken()
    const token2 = issueOpaqueToken()
    expect(token1.raw).not.toBe(token2.raw)
  })

  it('hash matches sha256 of the raw token', () => {
    const token = issueOpaqueToken()
    expect(token.hash).toBe(sha256(token.raw))
  })
})