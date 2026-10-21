//src/common/middlewares/requestLogger.ts
import type {
  Request,
  Response,
  NextFunction,
} from 'express'

import { logger } from '../utils/logger.js'

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const startedAt = Date.now()
  const path = req.path || '/'
  const ip = req.ip || 'unknown'

  const userAgent = (req.get('user-agent') ?? '')
    .replace(/[\r\n\t]/g, ' ')
    .slice(0, 200)

  logger.debug(
    {
      type: 'request',
      method: req.method,
      path,
      ip,
      userAgent,
    },
    `${req.method} ${path}`,
  )

  res.on('finish', () => {
    const durationMs = Date.now() - startedAt
    const status = res.statusCode

    const level =
      status >= 500 ? 'error'
      : status >= 400 ? 'warn'
      : 'info'

    logger[level](
      {
        type: 'request_out',
        method: req.method,
        path,
        status,
        durationMs,
        ip,
        userId: req.user?.id,
      },
      `${req.method} ${path} ${status} ${durationMs}ms`,
    )

    if (durationMs > 1000) {
      logger.warn(
        {
          type: 'request_slow',
          method: req.method,
          path,
          durationMs,
          userId: req.user?.id,
        },
        `Slow request: ${req.method} ${path}`,
      )
    }
  })

  next()
}