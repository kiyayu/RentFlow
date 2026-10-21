import type {
  NextFunction,
  Request,
  Response,
} from 'express'

import { redis } from '../../config/redis.js'
import { ApiError } from '../errors/apiErrors.js'
import { logger } from '../utils/logger.js'

type RateLimitOptions = {
  windowSeconds: number
  maxRequests: number
  identifier: string
}

export const createRateLimiter = (
  options: RateLimitOptions,
) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const ip = req.ip || 'unknown'
      const key = `rateLimiter:${options.identifier}:${ip}`

      const count = await redis.increment(
        key,
        options.windowSeconds,
      )

      if (count > options.maxRequests) {
        const retryAfter = Math.max(1, await redis.ttl(key))

        res.setHeader('Retry-After', String(retryAfter))

        logger.warn(
          {
            type: 'rate_limited',
            identifier: options.identifier,
            ip,
            count,
            retryAfter,
          },
          `Rate limit exceeded: ${options.identifier}`,
        )

        throw ApiError.tooManyRequests(
          `Too many requests. Try again in ${retryAfter} seconds.`,
        )
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}

export const loginRateLimiter = createRateLimiter({
  windowSeconds: 5 * 60,
  maxRequests: 10,
  identifier: 'login',
})

export const registerRateLimiter = createRateLimiter({
  windowSeconds: 60 * 60,
  maxRequests: 5,
  identifier: 'register',
})

export const otpVerifyRateLimiter = createRateLimiter({
  windowSeconds: 10 * 60,
  maxRequests: 15,
  identifier: 'otp-verify',
})

export const otpSendRateLimiter = createRateLimiter({
  windowSeconds: 60 * 60,
  maxRequests: 5,
  identifier: 'otp-send',
})