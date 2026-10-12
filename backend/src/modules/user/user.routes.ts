import express from 'express'
import { validation } from '../../common/middlewares/validation.js'
import { userController } from './user.controller.js'
import { asyncHandler } from '../../common/middlewares/asyncHandler.js'
import { authenticate } from '../../common/middlewares/authMiddleware.js'
import { changeEmailSchema, listUsersQuerySchema, updateUserSchema , setAvatarSchema} from './user.validation.js'

// router
const router = express.Router()

router.get('/profile', authenticate, asyncHandler(userController.getUserProfie))
router.put('/update', authenticate, validation(updateUserSchema), asyncHandler(userController.updateUserProfile) )
router.put('/change-email', authenticate, validation(changeEmailSchema), asyncHandler(userController.changeUserEmail))
router.put('/deactivate', authenticate, asyncHandler(userController.deactivateUser))
router.put('/hard-delete', authenticate, asyncHandler(userController.hardDeleteUser))
router.delete('/lists', authenticate, validation(listUsersQuerySchema), asyncHandler(userController.listUser) )
router.put('/avatar', authenticate, validation(setAvatarSchema), asyncHandler(userController.setAvatar))
router.delete('/avatar', authenticate, asyncHandler(userController.removeAvatar))
export default router