// src/common/utils/logger.ts
import pino from 'pino'
import { env } from '../../config/env.js'

const isDev = env.nodeEnv === 'development'

export const logger = pino({
  level:     isDev ? 'debug' : 'info',
  transport: isDev
    ? {
        target:  'pino-pretty',
        options: {
          colorize:      true,
          translateTime: 'SYS:HH:MM:ss',
          ignore:        'pid,hostname',
        },
      }
    : undefined,
  redact: {
    paths: [
      'password',
      'refreshToken',
      'accessToken',
      '*.password',
      '*.refreshToken',
      'req.headers.cookie',
      'req.headers.authorization',
    ],
    censor: '[Redacted]',
  },
})


export const authLogger = {

  loginSuccess: (userId: string, ip: string): void => {
    logger.info({
      type:   'auth',
      event:  'login_success',
      userId,
      ip,
    }, `Login success: ${userId}`)
  },

  loginFailed: (email: string, ip: string, reason: string): void => {
    logger.warn({
      type:   'auth',
      event:  'login_failed',
      email,
      ip,
      reason,
    }, `Login failed: ${email} — ${reason}`)
  },

  logout: (userId: string, ip: string): void => {
    logger.info({
      type:   'auth',
      event:  'logout',
      userId,
      ip,
    }, `Logout: ${userId}`)
  },

  tokenRefresh: (userId: string, ip: string): void => {
    logger.debug({
      type:   'auth',
      event:  'token_refresh',
      userId,
      ip,
    }, `Token refresh: ${userId}`)
  },

  tokenTheftDetected: (userId: string, ip: string): void => {

    logger.error({
      type:   'auth',
      event:  'token_theft_detected',
      userId,
      ip,
    }, `TOKEN THEFT DETECTED: ${userId} — all sessions invalidated`)
  },

  googleOAuth: (userId: string, isNewUser: boolean, ip: string): void => {
    logger.info({
      type:      'auth',
      event:     'google_oauth',
      userId,
      isNewUser,
      ip,
    }, `Google OAuth: ${userId} (${isNewUser ? 'new user' : 'existing user'})`)
  },

  emailVerified: (userId: string): void => {
    logger.info({
      type:   'auth',
      event:  'email_verified',
      userId,
    }, `Email verified: ${userId}`)
  },

  passwordReset: (userId: string, ip: string): void => {
    logger.info({
      type:   'auth',
      event:  'password_reset',
      userId,
      ip,
    }, `Password reset: ${userId}`)
  },

  rateLimited: (ip: string, endpoint: string): void => {
    logger.warn({
      type:     'auth',
      event:    'rate_limited',
      ip,
      endpoint,
    }, `Rate limited: ${ip} on ${endpoint}`)
  },
}