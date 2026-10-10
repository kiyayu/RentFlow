import {redis} from '../../config/redis.js'
import { ApiError } from '../errors/apiErrors.js'
import { NextFunction, Request, Response } from 'express'
import { logger } from '../utils/logger.js'
type RateLimitOptions={
    windowSeconds:number
    maxRequests:number
    identifier:string
}

export const createRateLimiter = (options: RateLimitOptions) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ip = req.ip || 'unknown'
      const key = `rateLimiter:${options.identifier}:${ip}`
      const count = await redis.increment(key, options.windowSeconds)

      if (count > options.maxRequests) {
        const retryAfter = await redis.ttl(key)
        logger.warn({
          type: 'rate_limited',
          identifier: options.identifier,
          ip,
          count,
          retryAfter,
        }, `Rate limit exceeded: ${options.identifier} from ${ip}`)

        throw ApiError.tooManyRequests(`Too many requests, please try again in ${retryAfter}s`)
      }

      next()
    } catch (err) {
      next(err)
    }
  }
}
export const loginRateLimiter = createRateLimiter({ windowSeconds: 5 * 60, maxRequests: 10, identifier: 'login' })
export const registerRateLimiter = createRateLimiter({ windowSeconds: 60 * 60, maxRequests: 5, identifier: 'register' })
export const otpVerifyRateLimiter = createRateLimiter({ windowSeconds: 10 * 60, maxRequests: 15, identifier: 'otp-verify' })
export const otpSendRateLimiter = createRateLimiter({ windowSeconds: 60 * 60, maxRequests: 5, identifier: 'otp-send' })  