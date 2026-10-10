//src/common/middlewares/authMiddleware.ts
import { Response, Request, NextFunction } from "express";
import { ApiError } from "../errors/apiErrors.js";
import { verifyAccessToken } from "../utils/jwt.js";

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.signedCookies.accessToken
    if (!token) throw ApiError.unauthorized('Missing or expired token')

    const decoded = await verifyAccessToken(token)
    req.user = decoded

    next()
  } catch (err) {
    next(err)
  }
}
