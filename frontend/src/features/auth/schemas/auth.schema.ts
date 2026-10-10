//src/features/auth/schemas/auth.schema.ts
import { z } from 'zod'

const email = z.string().trim().min(1, 'Email is required').email('Enter a valid email')

// Mirrors passwordSchema in the backend. Keep the two in sync.
export const passwordRules = z
  .string()
  .min(8, 'Use at least 8 characters')
  .max(72, 'Use at most 72 characters')
  .regex(/[A-Z]/, 'Include at least one uppercase letter')
  .regex(/[0-9]/, 'Include at least one number')

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Password is required'),
})

export const registerSchema = z.object({
  name: z.string().trim().min(3, 'Name must be at least 3 characters'),
  email,
  password: passwordRules,
})

export const verifyOtpSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, 'Enter the 6-digit code'),
})

export const forgotPasswordSchema = z.object({ email })

const confirmMatches = <T extends { newPassword: string; confirmPassword: string }>(v: T) =>
  v.newPassword === v.confirmPassword

export const resetPasswordSchema = z
  .object({
    newPassword: passwordRules,
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine(confirmMatches, { message: 'Passwords do not match', path: ['confirmPassword'] })

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().optional(),
    newPassword: passwordRules,
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine(confirmMatches, { message: 'Passwords do not match', path: ['confirmPassword'] })

export type LoginPayload = z.infer<typeof loginSchema>
export type RegisterPayload = z.infer<typeof registerSchema>
export type VerifyOtpForm = z.infer<typeof verifyOtpSchema>
export type ForgotPasswordPayload = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordForm = z.infer<typeof resetPasswordSchema>
export type ChangePasswordForm = z.infer<typeof changePasswordSchema>