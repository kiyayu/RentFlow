// src/modules/auth/auth.helpers.ts
import crypto, { randomBytes, randomInt } from 'crypto'
import { OTP_TTL_MS, RESET_TTL_MS } from './auth.constants.js'

export const sha256 = (value: string): string =>
  crypto.createHash('sha256').update(value).digest('hex')


export const safeEqualHex = (a?: string | null, b?: string | null): boolean => {
  if (!a || !b || a.length !== b.length) return false
  return crypto.timingSafeEqual(Buffer.from(a, 'hex'), Buffer.from(b, 'hex'))
}

export const normalizeEmail = (email: string): string => email.trim().toLowerCase()


export const issueOpaqueToken = (): { raw: string; hash: string } => {
  const raw = randomBytes(32).toString('hex')
  return { raw, hash: sha256(raw) }
}

export const issueOtp = (): { code: string; hash: string; expiry: Date } => {
  const code = randomInt(100000, 1000000).toString()
  return { code, hash: sha256(code), expiry: new Date(Date.now() + OTP_TTL_MS) }
}

export const issueResetToken = (): { raw: string; hash: string; expiry: Date } => {
  const { raw, hash } = issueOpaqueToken()
  return { raw, hash, expiry: new Date(Date.now() + RESET_TTL_MS) }
}