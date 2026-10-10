//src/modules/upload/upload.routes.ts
import express from 'express'
import { authenticate } from '../../common/middlewares/authMiddleware.js'
import { validation } from '../../common/middlewares/validation.js'
import { createRateLimiter } from '../../common/middlewares/rateLimiter.js'
import { uploadController } from './upload.controller.js'
import { signUploadSchema, confirmUploadSchema, deleteUploadSchema } from './upload.validation.js'

const router = express.Router()
const uploadLimiter = createRateLimiter({ windowSeconds: 60, maxRequests: 20, identifier: 'upload' })

router.use(authenticate, uploadLimiter)

router.post('/sign', validation(signUploadSchema), uploadController.sign)
router.post('/confirm', validation(confirmUploadSchema), uploadController.confirm)
router.delete('/', validation(deleteUploadSchema), uploadController.remove)

export default router