//src/modules/auth/auth.controller.ts
import { Request, Response } from "express"
import { authService } from "./auth.service.js"
import { sendSuccess } from "../../common/handlers/responseHandler.js"
import { asyncHandler } from "../../common/middlewares/asyncHandler.js"
import { clearAuthCookie, setAccessTokenCookie, setRefreshTokenCookie } from "../../common/utils/cookes.js"
import { env } from "../../config/env.js"
import { parseDeviceLabel } from "../../common/utils/deviceLabel.js"
import { CreateLoginDTO, DeviceMetadata ,
    ForgotPasswordDTO, ResetPasswordDTO, VerifyOtpDTO, ResendOtpDTO,
     ChangePasswordDTO, RevokeSessionParamsDTO} from "./auth.dto.js"
import { CreateUserDTO } from "../user/user.dto.js"
import { oauth } from "../../common/utils/oauth.js"

const buildMetadata = (req: Request): DeviceMetadata => {
  const userAgent = req.headers['user-agent']
  return {
    ip: req.ip ?? 'unknown',
    userAgent: userAgent ?? 'unknown',
    label: parseDeviceLabel(userAgent),
    deviceInfo: undefined,
  }
}

export const authController = {
  authRegister: asyncHandler(async (req: Request, res: Response) => {
    const data = req.data?.body as CreateUserDTO
    const user = await authService.register(data)

    return sendSuccess({
      res,
      data: user,
      message: "Registration successful. Please check your email for a verification code.",
      statusCode: 201,
    })
  }),

  authLogin: asyncHandler(async (req: Request, res: Response) => {
    const data = req.data?.body as CreateLoginDTO
    const metadata = buildMetadata(req) as DeviceMetadata

    const { user, accessToken, refreshToken } = await authService.login(data, metadata)

    setAccessTokenCookie(res, accessToken)
    setRefreshTokenCookie(res, refreshToken)

    return sendSuccess({ res, data: user, message: "Logged in successfully" })
  }),

authGoogleCallback: asyncHandler(async (req: Request, res: Response) => {
  try {
    const { code, state } = req.query as { code: string; state: string }
    await oauth.verifyState(state)
    const googleUser = await oauth.exchangeGoogleCode(code)
    const metadata = buildMetadata(req)
    const { accessToken, refreshToken } = await authService.googleAuth(googleUser, metadata)

    setAccessTokenCookie(res, accessToken)
    setRefreshTokenCookie(res, refreshToken)

    return res.redirect(`${env.clientUrl}/app/dashboard`)
  } catch {
    return res.redirect(`${env.clientUrl}/login?error=google`)
  }
}),
authGoogleStart: async (req: Request, res: Response) => {
  const url = await oauth.buildGoogleUrl()
  return res.redirect(url)
},
  refreshToken: asyncHandler(async (req: Request, res: Response) => {
    const incomingRawToken = req.signedCookies?.refreshToken
    const { accessToken, refreshToken } = await authService.refreshToken(incomingRawToken)

    setAccessTokenCookie(res, accessToken)
    if (refreshToken) setRefreshTokenCookie(res, refreshToken)

    return sendSuccess({ res, data: { accessToken }, message: "Token refreshed" })
  }),

  logout: asyncHandler(async (req: Request, res: Response) => {
    const incomingRawToken = req.signedCookies?.refreshToken
    await authService.logout(incomingRawToken)

    clearAuthCookie(res)

    return sendSuccess({ res, message: "Logged out successfully" })
  }),

  forgotPassword: asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.data?.body as ForgotPasswordDTO
    const message = await authService.forgotPassword(email)
    return sendSuccess({ res, message })
  }),

  resetPassword: asyncHandler(async (req: Request, res: Response) => {
    const { token, newPassword } = req.data?.body as ResetPasswordDTO
    const message = await authService.resetPassword(token, newPassword)
    return sendSuccess({ res, message })
  }),

  verifyOtp: asyncHandler(async (req: Request, res: Response) => {
    const { email, otp } = req.data?.body as VerifyOtpDTO
    const message = await authService.verifyOtp(email, otp)
    return sendSuccess({ res, message })
  }),

  resendOtp: asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.data?.body as ResendOtpDTO
    const message = await authService.resendOtp(email)
    return sendSuccess({ res, message })
  }),

  changePassword: asyncHandler(async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.data?.body as ChangePasswordDTO
    const userId = req.user!.id


    const incomingRawToken = req.signedCookies?.refreshToken
    const currentFamily = incomingRawToken
      ? await authService.resolveFamilyIdFromToken(incomingRawToken)
      : null

    const message = await authService.changePassword(userId, currentPassword, newPassword, currentFamily)
    return sendSuccess({ res, message })
  }),

  getSessions: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id
    const sessions = await authService.getSessions(userId)
    return sendSuccess({ res, data: sessions, message: "Sessions retrieved" })
  }),

  revokeSession: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id
    const { familyId } = req.data?.params as RevokeSessionParamsDTO
    await authService.revokeSession(userId, familyId)
    return sendSuccess({ res, message: "Session revoked" })
  }),
}
