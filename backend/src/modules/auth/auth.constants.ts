// src/modules/auth/auth.constants.ts

export const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000
export const GRACE_WINDOW_MS = 10 * 1000

export const OTP_TTL_MS = 5 * 60 * 1000
export const OTP_COOLDOWN_MS = 60 * 1000
export const OTP_MAX_ATTEMPTS = 5

export const RESET_TTL_MS = 60 * 60 * 1000

export const GENERIC_RESET_MESSAGE =
  'If an account exists for that email, a reset link has been sent'