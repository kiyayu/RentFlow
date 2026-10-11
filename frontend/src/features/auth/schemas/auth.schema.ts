//src/features/auth/schemas/auth.schema.ts
import { z } from 'zod'

// Every message below is a translation key (namespace "validation"),
// translated by the form with translateMessage(). Keep in sync with the backend rules.
const email = z
  .string()
  .trim()
  .min(1, 'validation:emailRequired')
  .email('validation:emailInvalid')

export const passwordRules = z
  .string()
  .min(8, 'validation:passwordMin')
  .max(72, 'validation:passwordMax')
  .regex(/[A-Z]/, 'validation:passwordUppercase')
  .regex(/[0-9]/, 'validation:passwordNumber')

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'validation:passwordRequired'),
})

export const registerSchema = z.object({
  name: z.string().trim().min(3, 'validation:nameMin'),
  email,
  password: passwordRules,
})

export const verifyOtpSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, 'validation:otpFormat'),
})

export const forgotPasswordSchema = z.object({ email })

const confirmMatches = <T extends { newPassword: string; confirmPassword: string }>(v: T) =>
  v.newPassword === v.confirmPassword

export const resetPasswordSchema = z
  .object({
    newPassword: passwordRules,
    confirmPassword: z.string().min(1, 'validation:confirmRequired'),
  })
  .refine(confirmMatches, { message: 'validation:passwordsMismatch', path: ['confirmPassword'] })

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().optional(),
    newPassword: passwordRules,
    confirmPassword: z.string().min(1, 'validation:confirmRequired'),
  })
  .refine(confirmMatches, { message: 'validation:passwordsMismatch', path: ['confirmPassword'] })

export type LoginPayload = z.infer<typeof loginSchema>
export type RegisterPayload = z.infer<typeof registerSchema>
export type VerifyOtpForm = z.infer<typeof verifyOtpSchema>
export type ForgotPasswordPayload = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordForm = z.infer<typeof resetPasswordSchema>
export type ChangePasswordForm = z.infer<typeof changePasswordSchema>