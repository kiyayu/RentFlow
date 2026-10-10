// src/common/middlewares/requireRole.ts
import { Request, Response, NextFunction } from "express"
import { ApiError } from "../errors/apiErrors.js"
export const requireRole = (allowedRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const userRole = req.user?.role
      if (!userRole) throw ApiError.unauthorized('Authentication required')
      if (!allowedRoles.includes(userRole)) {
        throw ApiError.forbidden('Access denied. Insufficient permissions')
      }
      next()
    } catch (err) {
      next(err)
    }
  }