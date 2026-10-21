import { Response, Request, NextFunction,   } from "express";
import { ApiError } from "../errors/apiErrors.js";
import { sendError } from "./responseHandler.js";
import { logger } from "../utils/logger.js";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    const level = err.statusCode < 500 ? 'warn' : 'error'
    logger[level]({
      method: req.method,
      url: req.originalUrl,
      ip: req.ip || 'unknown',
      stack: err?.stack,
    }, err.message)

    return sendError({ res, message: err.message, statusCode: err.statusCode })
  }

  if (err instanceof Error) {
    logger.error({
      method: req.method,
      url: req.originalUrl,
      stack: err?.stack,
      ip: req.ip || 'unknown',
    }, err.message)

    return sendError({ res, message: 'Internal server error', statusCode: 500 })
  }

  logger.error({
    method: req.method,   
    url: req.originalUrl,
    ip: req.ip || 'unknown',
    err,
  }, 'Unknown error thrown')

  return sendError({ res, message: 'Internal server error', statusCode: 500 })
}