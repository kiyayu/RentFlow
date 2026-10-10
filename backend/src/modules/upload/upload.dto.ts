//src/modules/upload/upload.dto.ts
import { z } from 'zod'
import { signUploadSchema, confirmUploadSchema, deleteUploadSchema } from './upload.validation.js'

export type SignUploadDTO = z.infer<typeof signUploadSchema>['body']
export type ConfirmUploadDTO = z.infer<typeof confirmUploadSchema>['body']
export type DeleteUploadDTO = z.infer<typeof deleteUploadSchema>['query']