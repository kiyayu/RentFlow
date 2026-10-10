//src/modules/upload/upload.controller.ts
import { Request, Response } from 'express'
import { sendSuccess } from '../../common/handlers/responseHandler.js'
import { asyncHandler } from '../../common/middlewares/asyncHandler.js'
import { uploadService } from './upload.service.js'
import type { ConfirmUploadDTO, DeleteUploadDTO, SignUploadDTO } from './upload.dto.js'

export const uploadController = {
  sign: asyncHandler(async (req: Request, res: Response) => {
    const body = req.data?.body as SignUploadDTO
    return sendSuccess({ res, data: uploadService.sign(req.user!.id, body), message: 'Upload signed' })
  }),

  confirm: asyncHandler(async (req: Request, res: Response) => {
    const body = req.data?.body as ConfirmUploadDTO
    const data = await uploadService.confirm(req.user!.id, body)
    return sendSuccess({ res, data, message: 'Upload confirmed' })
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    const { fileKey } = req.data?.query as DeleteUploadDTO
    await uploadService.remove(req.user!.id, fileKey)
    return sendSuccess({ res, message: 'File deleted' })
  }),
}