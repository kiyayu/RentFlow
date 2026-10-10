//src/features/auth/schemas/auth.schema.test.ts
import { describe, it, expect } from 'vitest'
import { loginSchema, registerSchema, verifyOtpSchema, resetPasswordSchema } from './auth.schema'

describe('registerSchema', () => {
  const valid = { name: 'Test User', email: 'a@b.com', password: 'Passw0rdOK' }

  it('accepts valid input', () => {
    expect(registerSchema.safeParse(valid).success).toBe(true)
  })
  it.each([
    ['short name', { ...valid, name: 'Al' }],
    ['bad email', { ...valid, email: 'nope' }],
    ['short password', { ...valid, password: 'Pass1' }],
    ['no uppercase', { ...valid, password: 'passw0rdok' }],
    ['no number', { ...valid, password: 'PasswordOK' }],
    ['too long', { ...valid, password: 'Aa1' + 'x'.repeat(70) }],
  ])('rejects %s', (_label, input) => {
    expect(registerSchema.safeParse(input).success).toBe(false)
  })
})

describe('loginSchema', () => {
  it('only requires a non-empty password (no strength rules at login)', () => {
    expect(loginSchema.safeParse({ email: 'a@b.com', password: 'weak' }).success).toBe(true)
    expect(loginSchema.safeParse({ email: 'a@b.com', password: '' }).success).toBe(false)
  })
})

describe('verifyOtpSchema', () => {
  it('requires exactly 6 digits', () => {
    expect(verifyOtpSchema.safeParse({ otp: '123456' }).success).toBe(true)
    expect(verifyOtpSchema.safeParse({ otp: '12345' }).success).toBe(false)
    expect(verifyOtpSchema.safeParse({ otp: '12345a' }).success).toBe(false)
  })
})

describe('resetPasswordSchema', () => {
  it('requires matching passwords', () => {
    const base = { newPassword: 'Passw0rdOK', confirmPassword: 'Passw0rdOK' }
    expect(resetPasswordSchema.safeParse(base).success).toBe(true)
    expect(resetPasswordSchema.safeParse({ ...base, confirmPassword: 'Different1' }).success).toBe(false)
  })
})