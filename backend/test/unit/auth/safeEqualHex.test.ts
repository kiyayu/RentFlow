// test/unit/auth/safeEqualHex.test.ts  (or wherever it lives in your combined file)
import { describe, it, expect } from 'vitest'
import { safeEqualHex, sha256 } from '../../../src/modules/auth/auth.helpers'  // fill in the real path

describe('safeEqualHex', () => {
  it('???', () => {
    // happy path — same content, same hash, must be true
    const hash1 = sha256('hello')
    const hash2 = sha256('hello')
    expect(safeEqualHex(hash1, hash2)).toBe(true)
  })

  it('???', () => {
    // same length, DIFFERENT content — must be false
    const hash1 = sha256('hello')
    const hash2 = sha256('janzo')
    // (this is the test that would catch the length-only bug you almost wrote)
    expect(safeEqualHex(hash1, hash2)).toBe(false)
  })

  it('???', () => {
    // different length entirely — must be false
    const hash1 = sha256('short')
    const hash2 = sha256('longlonglength')
    expect(safeEqualHex(hash1, hash2)).toBeFalsy()
  })

  it('???', () => {
    // undefined/null on either side — must be false
    const hash1 = undefined
    const hash2 = sha256('hello')
    expect(safeEqualHex(hash1, hash2)).toBeFalsy()
  })

})