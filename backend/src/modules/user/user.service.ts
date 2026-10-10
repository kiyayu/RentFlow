//src/modules/user/user.service.ts
import { ApiError } from '../../common/errors/apiErrors.js'
import { emailQueue } from '../../queues/email.queue.js'
import {  issueOtp } from '../auth/auth.helpers.js'
 import { User, TokenFamily } from './user.model.js'
import { UserResponseDTO } from './user.dto.js'
import { DEFAULT_PAGE_SIZE } from './user.constants.js'
import { notificationService } from '../notification/notification.service.js'
import { uploadService } from '../upload/upload.service.js'
import { storage } from '../upload/storage/index.js'
import { logger } from '../../common/utils/logger.js'

export const mapResponse = (user: any): UserResponseDTO => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  emailVerified: user.emailVerified,
  role: user.role,
  createdAt: user.createdAt,
    avatarUrl: user.avatarUrl ?? undefined,
})

export const userService = {
  getProfile: async (userId: string): Promise<UserResponseDTO> => {
    const user = await User.findById(userId)
    if (!user) throw ApiError.notFound('User not found')
    return mapResponse(user)
  },

  updateProfile: async (userId: string, data: { name?: string }): Promise<UserResponseDTO> => {
    const user = await User.findById(userId)
    if (!user) throw ApiError.notFound('User not found')
    if (data.name !== undefined) user.name = data.name
    await user.save()
    return mapResponse(user)
  },

  changeEmail: async (userId: string, newEmail: string): Promise<string> => {
    const user = await User.findById(userId)
    if (!user) throw ApiError.notFound('User not found')
    if (newEmail === user.email) throw ApiError.badRequest('This is already your email')
    const oldEmail = user.email
    const taken = await User.findOne({ email: newEmail })
    if (taken) throw ApiError.conflict('Email already in use')

    const otp = issueOtp()

    user.email = newEmail
    user.emailVerified = false
    user.otpCodeHash = otp.hash
    user.otpExpiry = otp.expiry
    user.otpAttempts = 0
    user.lastOtpSentAt = new Date()
    await user.save()
  
    await emailQueue.add('email', { email: newEmail, name: user.name, otp: otp.code })
 
 
await notificationService.notify({
  userId, type: 'email_changed', emailTo: oldEmail, name: user.name, meta: { newEmail },
})
    return 'Email updated. Please verify your new email address.'
  },

  deactivate: async (userId: string): Promise<string> => {
    const user = await User.findById(userId)
    if (!user) throw ApiError.notFound('User not found')
    user.isActive = false
    await user.save()
    await TokenFamily.deleteMany({ userId: user._id })
    return 'Account deactivated'
  },

  hardDelete: async (userId: string): Promise<string> => {
    const user = await User.findById(userId)
    if (!user) throw ApiError.notFound('User not found')
    await TokenFamily.deleteMany({ userId: user._id })
    await User.deleteOne({ _id: user._id })
    return 'Account permanently deleted'
  },

  listUsers: async (
    page: number,
    limit: number = DEFAULT_PAGE_SIZE
  ): Promise<{ users: UserResponseDTO[]; total: number }> => {
    const skip = (page - 1) * limit
    const [users, total] = await Promise.all([
      User.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments({}),
    ])
    return { users: users.map(mapResponse), total }
  },
  setAvatar: async (userId: string, fileKey: string): Promise<UserResponseDTO> => {
    // validates ownership, purpose, real size and format; deletes the file if it breaks a rule
    const { fileUrl } = await uploadService.confirm(userId, { purpose: 'avatar', fileKey })

    const user = await User.findById(userId).select('+avatarKey')
    if (!user) throw ApiError.notFound('User not found')

    const previousKey = user.avatarKey
    user.avatarKey = fileKey
    user.avatarUrl = fileUrl
    await user.save()

    // only after the new avatar is saved
    if (previousKey && previousKey !== fileKey) {
      storage.delete(previousKey).catch((err) =>
        logger.warn({ err, previousKey }, 'old avatar cleanup failed'))
    }
    return mapResponse(user)
  },

  removeAvatar: async (userId: string): Promise<UserResponseDTO> => {
    const user = await User.findById(userId).select('+avatarKey')
    if (!user) throw ApiError.notFound('User not found')

    const key = user.avatarKey
    user.avatarKey = undefined
    user.avatarUrl = undefined
    await user.save()

    if (key) {
      storage.delete(key).catch((err) =>
        logger.warn({ err, key }, 'avatar cleanup failed'))
    }
    return mapResponse(user)
  },
}