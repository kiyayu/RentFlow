//src/common/handlers/responseHandler.ts
import { Response } from "express";

type Pagination = {
  total?: number
  totalPage?: number
  currentPage?: number
}

type SuccessOptions = {
  res: Response
  message: string
  statusCode?: number
  data?: unknown
  meta?: unknown
  pagination?: Pagination
}

type ErrorOptions = {
  res: Response
  message: string
  statusCode: number
  detail?: unknown
}

export const sendSuccess = (options: SuccessOptions) => {
  const statusCode = options.statusCode ?? 200

  const payload: Record<string, unknown> = {
    success: true,
    message: options.message,
  }
  if (options.data !== undefined) payload.data = options.data
  if (options.meta !== undefined) payload.meta = options.meta
  if (options.pagination !== undefined) payload.pagination = options.pagination

  return options.res.status(statusCode).json(payload)
}

export const sendError = (options: ErrorOptions) => {
  const payload: Record<string, unknown> = {
    success: false,
    message: options.message,
  }
  if (options.detail !== undefined) payload.detail = options.detail

  return options.res.status(options.statusCode).json(payload)
}