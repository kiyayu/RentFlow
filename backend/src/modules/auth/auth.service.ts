// src/modules/auth/service.ts
import { ApiError } from "../../common/errors/apiErrors.js"
import { signAccessToken } from "../../common/utils/jwt.js"
import { GoogleUser } from "../../common/utils/oauth.js"
import { comparePassword, hashPassword } from "../../common/utils/password.js"
import { emailQueue } from "../../queues/email.queue.js"
import { resetQueue } from "../../queues/reset.queue.js"
import { CreateUserDTO, UserResponseDTO } from "../user/user.dto.js"
import { User, TokenFamily } from "../user/user.model.js"
import { CreateLoginDTO, DeviceMetadata, SessionResponseDTO } from "./auth.dto.js"
import { REFRESH_TTL_MS, GRACE_WINDOW_MS, OTP_COOLDOWN_MS, OTP_MAX_ATTEMPTS, GENERIC_RESET_MESSAGE } from "./auth.constants.js"
import { sha256, safeEqualHex, normalizeEmail, issueOpaqueToken, issueOtp, issueResetToken } from "./auth.helpers.js"
import { mapResponse } from "../user/user.service.js"
import { notificationService } from "../notification/notification.service.js"
// Shared session-issuing step — used by both login and googleAuth,
// since from this point on there's no difference between how she arrived.
const createSession = async (user: any, metadata: DeviceMetadata) => {
  const { raw, hash } = issueOpaqueToken()
  const now = new Date()

  await TokenFamily.create({
    userId: user._id,
    currentTokenHash: hash,
    
    lastUsedAt: now,
    expiresAt: new Date(now.getTime() + REFRESH_TTL_MS),
    ip: metadata.ip ?? 'unknown',
    userAgent: metadata.userAgent,
    label: metadata.label,
    deviceInfo: metadata.deviceInfo,
  })

  const accessToken = await signAccessToken(user.role, user._id, user.name, user.email)
  return { accessToken, refreshToken: raw }
}

export const authService = {
  register: async (data: CreateUserDTO): Promise<UserResponseDTO> => {
    const { name, password } = data
    const email = normalizeEmail(data.email)

    const existingUser = await User.findOne({ email })
    if (existingUser?.emailVerified === true) {
      throw ApiError.conflict('Email is in use')
    }

    const otp = issueOtp()
    const hashedPassword = await hashPassword(password)

    if (existingUser) {
      existingUser.name = name
      existingUser.password = hashedPassword
      existingUser.otpCodeHash = otp.hash
      existingUser.otpExpiry = otp.expiry
      existingUser.lastOtpSentAt = new Date()
      existingUser.otpAttempts = 0
      await existingUser.save()
      await emailQueue.add('email', { email, name, otp: otp.code })
      return mapResponse(existingUser)
    }

    const user = new User({
      name,
      email,
      password: hashedPassword,
      otpCodeHash: otp.hash,
      otpExpiry: otp.expiry,
      lastOtpSentAt: new Date(),
      otpAttempts: 0,
    })
    await user.save()
    await emailQueue.add('email', { email, name, otp: otp.code })
    return mapResponse(user)
  },

  login: async (
    data: CreateLoginDTO,
    metadata: DeviceMetadata
  ): Promise<{ user: UserResponseDTO; accessToken: string; refreshToken: string }> => {
    const email = normalizeEmail(data.email)
    // select:false fields needed here: password, googleId
    const user = await User.findOne({ email }).select('+password +googleId')

    if (!user) throw ApiError.unauthorized('Invalid credentials')
    if (user.isActive === false) throw ApiError.forbidden('Account is deactivated')
    if (!user.password) {
      throw ApiError.badRequest('This account uses Google sign-in')
    }

    const isMatch = await comparePassword(data.password, user.password)
    if (!isMatch) throw ApiError.unauthorized('Invalid credentials')

    if (!user.googleId && user.emailVerified === false) {
      throw ApiError.badRequest('Please verify your email before logging in')
    }
await notificationService.notify({
  userId: user.id, type: 'new_sign_in', emailTo: user.email, name: user.name,
  meta: { device: metadata.label, ip: metadata.ip },
})
    const { accessToken, refreshToken } = await createSession(user, metadata)
    return { user: mapResponse(user), accessToken, refreshToken }
  },

  refreshToken: async (
    incomingRawToken: string
  ): Promise<{ accessToken: string; refreshToken?: string }> => {
    if (!incomingRawToken) throw ApiError.unauthorized('No refresh token provided')

    const incomingHash = sha256(incomingRawToken)
    const now = new Date()
    const { raw: newRawToken, hash: newHash } = issueOpaqueToken()

    const rotated = await TokenFamily.findOneAndUpdate(
      { currentTokenHash: incomingHash, revokedAt: null },
      {
        currentTokenHash: newHash,
        previousTokenHash: incomingHash,
        lastUsedAt: now,
        expiresAt: new Date(now.getTime() + REFRESH_TTL_MS),
      },
      { new: true }
    )

    if (rotated) {
      const user = await User.findById(rotated.userId)
      if (!user) throw ApiError.notFound('User not found')
      const accessToken = await signAccessToken(user.role, user._id, user.name, user.email)
      return { accessToken, refreshToken: newRawToken }
    }

    // CAS failed — figure out why: race, replay, or unknown token
    const family = await TokenFamily.findOne({ previousTokenHash: incomingHash })
    if (!family) throw ApiError.unauthorized('Invalid refresh token')

    const lastUsed = family.lastUsedAt?.getTime() ?? 0
    const withinGrace = family.revokedAt === null && (now.getTime() - lastUsed) < GRACE_WINDOW_MS

    if (withinGrace) {
      const user = await User.findById(family.userId)
      if (!user) throw ApiError.notFound('User not found')
      const accessToken = await signAccessToken(user.role, user._id, user.name, user.email)
      return { accessToken } // no new refresh token — winner's cookie already covers this
    }

    family.revokedAt = now
    await family.save()
    throw ApiError.unauthorized('Session invalid, please log in again')
  },

  logout: async (incomingRawToken?: string): Promise<boolean> => {
    if (incomingRawToken) {
      const hash = sha256(incomingRawToken)
      await TokenFamily.deleteOne({ currentTokenHash: hash })
    }
    return true
  },

  getSessions: async (userId: string): Promise<SessionResponseDTO[]> => {
    const families = await TokenFamily.find({ userId, revokedAt: null })
    return families.map(family => ({
      id: family._id.toString(),
      device: family.label ?? 'Unknown device',
      ip: family.ip || 'unknwon',
      createdAt: family.createdAt,
      lastActive: family.lastUsedAt,
    }))
  },

  revokeSession: async (userId: string, familyId: string): Promise<boolean> => {
    const family = await TokenFamily.findById(familyId)
    if (!family) throw ApiError.notFound('Session not found')
    if (family.userId.toString() !== userId) throw ApiError.notFound('Session not found')
    await TokenFamily.deleteOne({ _id: family._id })
    return true
  },

 googleAuth: async (
  googleUser: GoogleUser,
  metadata: DeviceMetadata
): Promise<{ user: UserResponseDTO; accessToken: string; refreshToken: string }> => {

  if (googleUser.email_verified !== true) {
    throw ApiError.unauthorized('Google account email is not verified')
  }

  const email = normalizeEmail(googleUser.email)
  // FIX: must select googleId explicitly, or the mismatch check below is silently skipped
  let existingUser = await User.findOne({ email }).select('+googleId')

  if (existingUser) {
    if (existingUser.isActive === false) throw ApiError.forbidden('Account is deactivated')
    if (existingUser.googleId && existingUser.googleId !== googleUser.sub) {
      throw ApiError.unauthorized('Invalid authorization')
    }
    if (!existingUser.googleId) {
      existingUser.googleId = googleUser.sub
      if (existingUser.emailVerified === false) existingUser.emailVerified = true
      await existingUser.save()
    }
  } else {
    existingUser = new User({
      name: googleUser.name,
      email,
      googleId: googleUser.sub,
      emailVerified: true,
    })
    await existingUser.save()
  }
  const user = existingUser
await notificationService.notify({
  userId: user.id, type: 'new_sign_in', emailTo: user.email, name: user.name,
  meta: { device: metadata.label, ip: metadata.ip },
})
  const { accessToken, refreshToken } = await createSession(existingUser, metadata)
  return { user: mapResponse(existingUser), accessToken, refreshToken }
},

  forgotPassword: async (rawEmail: string): Promise<string> => {
    const email = normalizeEmail(rawEmail)
    const user = await User.findOne({ email })
    if (!user) return GENERIC_RESET_MESSAGE

    const reset = issueResetToken()
    user.passwordResetToken = reset.hash
    user.passwordResetExpiry = reset.expiry
    await user.save()

    await resetQueue.add('reset', { email: user.email, name: user.name, resetToken: reset.raw })
    return GENERIC_RESET_MESSAGE
  },

  resetPassword: async (rawToken: string, newPassword: string): Promise<string> => {
    const hashedIncoming = sha256(rawToken)
    const now = new Date()

    // select:false fields needed here: passwordResetToken, passwordResetExpiry
    const user = await User.findOne({ passwordResetToken: hashedIncoming })
      .select('+passwordResetToken +passwordResetExpiry')

    if (!user) throw ApiError.unauthorized('Invalid reset token')
    if (user.passwordResetExpiry && now > user.passwordResetExpiry) {
      throw ApiError.unauthorized('Reset token has expired')
    }

    user.password = await hashPassword(newPassword)
    user.passwordResetToken = undefined
    user.passwordResetExpiry = undefined
    await user.save()
    await notificationService.notify({
     userId: user.id, type: 'password_changed', emailTo: user.email, name: user.name,
     })

    await TokenFamily.deleteMany({ userId: user._id })
    return 'Password reset successfully, please log in again'
  },

  verifyOtp: async (rawEmail: string, submittedCode: string): Promise<string> => {
    const email = normalizeEmail(rawEmail)
    // select:false fields needed here: otpCodeHash, otpExpiry, otpAttempts
    const user = await User.findOne({ email }).select('+otpCodeHash +otpExpiry +otpAttempts')

    if (!user) throw ApiError.notFound('User not found')
    if (user.emailVerified === true) return 'Email is already verified'

    if (user.otpExpiry && new Date() > user.otpExpiry) {
      throw ApiError.badRequest('Code expired, please request a new one')
    }
    if ((user.otpAttempts ?? 0) >= OTP_MAX_ATTEMPTS) {
      throw ApiError.tooManyRequests('Too many incorrect attempts, please request a new code')
    }

    const submittedHash = sha256(submittedCode)
    if (!safeEqualHex(submittedHash, user.otpCodeHash)) {
      user.otpAttempts = (user.otpAttempts ?? 0) + 1
      await user.save()
      throw ApiError.badRequest('Invalid code')
    }

    user.emailVerified = true
    user.otpCodeHash = undefined
    user.otpExpiry = undefined
    user.otpAttempts = 0
    await user.save()
    return 'Email verified successfully'
  },

  resendOtp: async (rawEmail: string): Promise<string> => {
    const email = normalizeEmail(rawEmail)
    // select:false fields needed here: lastOtpSentAt
    const user = await User.findOne({ email }).select('+lastOtpSentAt')

    if (!user) throw ApiError.notFound('User not found')
    if (user.emailVerified === true) return 'User email already verified'

    const lastSent = user.lastOtpSentAt?.getTime() ?? 0
    if (Date.now() - lastSent < OTP_COOLDOWN_MS) {
      throw ApiError.tooManyRequests('Please wait before requesting another code')
    }

    const otp = issueOtp()
    user.otpCodeHash = otp.hash
    user.otpExpiry = otp.expiry
    user.lastOtpSentAt = new Date()
    user.otpAttempts = 0
    await user.save()

    await emailQueue.add('email', { email: user.email, name: user.name, otp: otp.code })
    return 'Please check your email inbox'
  },

  changePassword: async (
    userId: string,
    currentPassword: string | undefined,
    newPassword: string,
    currentFamilyId: string | null
  ): Promise<string> => {
    // select:false fields needed here: password
    const user = await User.findById(userId).select('+password')
    if (!user) throw ApiError.notFound('User not found')

    if (user.password) {
      if (!currentPassword) throw ApiError.badRequest('Current password is required')
      const isMatch = await comparePassword(currentPassword, user.password)
      if (!isMatch) throw ApiError.forbidden('Current password is incorrect')
    }

    user.password = await hashPassword(newPassword)
    await user.save()

    await TokenFamily.deleteMany({
      userId: user._id,
      _id: { $ne: currentFamilyId },
    })
    await notificationService.notify({
  userId, type: 'password_changed', emailTo: user.email, name: user.name,
})

    return 'Password updated successfully'
  },
  resolveFamilyIdFromToken: async (rawToken: string): Promise<string | null> => {
  const hash = sha256(rawToken)
  const family = await TokenFamily.findOne({ currentTokenHash: hash })
  return family ? family._id.toString() : null
},
}