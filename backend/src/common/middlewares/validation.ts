//src/common/middlewares/validation.ts
import { Request, Response, NextFunction } from 'express'
import { ApiError } from '../errors/apiErrors.js'
import { ZodType } from 'zod'

type ValidationData = {
  body?: unknown
  params?: unknown
  query?: unknown
}

export const validation = <T extends ZodType<ValidationData>>(
  schema: T
) =>
  (
    req: Request,
    _res: Response,
    next: NextFunction
  ): void => {
    const validate = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    })

    if (!validate.success) {
      const message = validate.error.issues
        .map(
          issue => `[path:${issue.path}] message:${issue.message}`
        )
        .join(', ')

      next(ApiError.badRequest(message))
      return
    }

    req.data = validate.data
    next()
  }