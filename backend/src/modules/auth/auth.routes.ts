//src/modules/auth/auth.routes.ts
import express from 'express'
import { asyncHandler } from '../../common/middlewares/asyncHandler.js'
import { validation } from '../../common/middlewares/validation.js'
import { authController } from './auth.controller.js'
import { authenticate } from '../../common/middlewares/authMiddleware.js'
import {
  loginRateLimiter,
  registerRateLimiter,
  otpSendRateLimiter,
  otpVerifyRateLimiter,
} from '../../common/middlewares/rateLimiter.js'
import { userSchema } from '../user/user.validation.js'
import {
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyOtpSchema,
  resendOtpSchema,
  changePasswordSchema,
  revokeSessionSchema,
} from './auth.validation.js'

const router = express.Router()

// ── Public routes ────────────────────────────────────────────────
router.post('/register', registerRateLimiter, validation(userSchema), asyncHandler(authController.authRegister))
router.post('/login', loginRateLimiter, validation(loginSchema), asyncHandler(authController.authLogin))

router.get('/google', asyncHandler(authController.authGoogleStart))
router.get('/google/callback', asyncHandler(authController.authGoogleCallback))

router.post('/refresh-token', asyncHandler(authController.refreshToken))
router.post('/logout', asyncHandler(authController.logout))

router.post('/forgot-password', otpSendRateLimiter, validation(forgotPasswordSchema), asyncHandler(authController.forgotPassword))
router.post('/reset-password', validation(resetPasswordSchema), asyncHandler(authController.resetPassword))

router.post('/verify-otp', otpVerifyRateLimiter, validation(verifyOtpSchema), asyncHandler(authController.verifyOtp))
router.post('/resend-otp', otpSendRateLimiter, validation(resendOtpSchema), asyncHandler(authController.resendOtp))

// ── Protected routes (require authentication) ──────────────────────
router.patch('/change-password', authenticate, validation(changePasswordSchema), asyncHandler(authController.changePassword))
router.get('/sessions', authenticate, asyncHandler(authController.getSessions))
router.delete('/sessions/:familyId', authenticate, validation(revokeSessionSchema), asyncHandler(authController.revokeSession))

export default router