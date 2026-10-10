//src/modules/auth/auth.validation.ts
import { z } from 'zod'
import { passwordSchema } from '../user/user.validation.js'

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email').transform(val => val.toLowerCase()),
    password: z.string().min(1).max(72),
  }).strict()
})

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email').transform(val => val.toLowerCase()),
  }).strict()
})

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Reset token is required'),
    newPassword: passwordSchema,
  }).strict()
})

export const verifyOtpSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email').transform(val => val.toLowerCase()),
    otp: z.string().length(6, 'Code must be 6 digits').regex(/^\d{6}$/, 'Code must be numeric'),
  }).strict()
})

export const resendOtpSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email').transform(val => val.toLowerCase()),
  }).strict()
})

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().optional(),
    newPassword: passwordSchema,
  }).strict()
})

export const revokeSessionSchema = z.object({
  params: z.object({
    familyId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid session id'),
  }).strict()
})