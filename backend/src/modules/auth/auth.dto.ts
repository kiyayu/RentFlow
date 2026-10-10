//src/modules/auth/auth.dto.ts
import { z } from 'zod'
import {
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyOtpSchema,
  resendOtpSchema,
  changePasswordSchema,
  revokeSessionSchema,
} from './auth.validation.js'

export type CreateLoginDTO = z.infer<typeof loginSchema>['body']
export type ForgotPasswordDTO = z.infer<typeof forgotPasswordSchema>['body']
export type ResetPasswordDTO = z.infer<typeof resetPasswordSchema>['body']
export type VerifyOtpDTO = z.infer<typeof verifyOtpSchema>['body']
export type ResendOtpDTO = z.infer<typeof resendOtpSchema>['body']
export type ChangePasswordDTO = z.infer<typeof changePasswordSchema>['body']
export type RevokeSessionParamsDTO = z.infer<typeof revokeSessionSchema>['params']

export type DeviceMetadata = {
  ip: string
  userAgent: string
  label: string
  deviceInfo?: string
}

export interface SessionResponseDTO {
  id: string
  device: string
  ip?: string
  createdAt: Date
  lastActive?: Date
  current?:boolean
}