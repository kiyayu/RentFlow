//src/modules/upload/upload.service.ts
import { randomBytes } from 'node:crypto'
import { ApiError } from '../../common/errors/apiErrors.js'
import { storage } from './storage/index.js'
import { FILE_KEY_PATTERN, UPLOAD_RULES, type UploadPurpose } from './upload.rules.js'
import type { ConfirmUploadDTO, SignUploadDTO } from './upload.dto.js'

// A key looks like  avatar/<userId>/<random>. The owner is part of the key.
const assertOwnKey = (userId: string, fileKey: string, purpose?: UploadPurpose) => {
  const [keyPurpose, keyOwner] = fileKey.split('/')
  if (!FILE_KEY_PATTERN.test(fileKey) || keyOwner !== userId || (purpose && keyPurpose !== purpose)) {
    // 404, not 403: don't reveal whether someone else's key exists
    throw ApiError.notFound('File not found')
  }
}

export const uploadService = {
  sign: (userId: string, input: SignUploadDTO) => {
    const rule = UPLOAD_RULES[input.purpose]
    if (!rule.types.includes(input.contentType)) {
      throw ApiError.badRequest(`File type not allowed. Allowed: ${rule.types.join(', ')}`)
    }
    if (input.size > rule.maxBytes) {
      throw ApiError.badRequest(`File is too large. Maximum is ${Math.floor(rule.maxBytes / 1024 / 1024)} MB`)
    }

    const fileKey = `${input.purpose}/${userId}/${randomBytes(16).toString('hex')}`
    const upload = storage.createUpload({ key: fileKey, allowedFormats: rule.formats })

    return { ...upload, fileKey, maxBytes: rule.maxBytes }
  },

  // Strong confirm: trust storage, never the browser.
  confirm: async (userId: string, { purpose, fileKey }: ConfirmUploadDTO) => {
    assertOwnKey(userId, fileKey, purpose)
    const rule = UPLOAD_RULES[purpose]

    const file = await storage.inspect(fileKey)
    if (!file) throw ApiError.notFound('Upload not found. Upload the file first')

    const bad =
      file.bytes > rule.maxBytes ? 'File is too large'
      : !rule.formats.includes(file.format) ? 'File type not allowed'
      : null
    if (bad) {
      await storage.delete(fileKey) // never leave a rule-breaking file in storage
      throw ApiError.badRequest(bad)
    }

    return { fileKey, fileUrl: file.url, bytes: file.bytes }
  },

  remove: async (userId: string, fileKey: string): Promise<void> => {
    assertOwnKey(userId, fileKey)
    await storage.delete(fileKey)
  },
}