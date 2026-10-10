//src/modules/upload/upload.validation.ts
import { z } from 'zod'
import { FILE_KEY_PATTERN, UPLOAD_PURPOSES } from './upload.rules.js'

const purpose = z.enum(UPLOAD_PURPOSES)
const fileKey = z.string().regex(FILE_KEY_PATTERN, 'Invalid file key')

export const signUploadSchema = z.object({
  body: z.object({
    purpose,
    contentType: z.string().min(1),
    size: z.number().int().positive(),
  }).strict(),
})

export const confirmUploadSchema = z.object({
  body: z.object({ purpose, fileKey }).strict(),
})

export const deleteUploadSchema = z.object({
  query: z.object({ fileKey }).strict(),
})