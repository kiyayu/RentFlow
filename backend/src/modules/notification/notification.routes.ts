//src/modules/notification/notification.routes.ts
import express from 'express'
import { authenticate } from '../../common/middlewares/authMiddleware.js'
import { validation } from '../../common/middlewares/validation.js'
import { notificationController } from './notification.controller.js'
import { listNotificationsSchema, notificationIdSchema } from './notification.validation.js'

const router = express.Router()

router.use(authenticate)


router.get('/',  validation(listNotificationsSchema), notificationController.list)
router.get('/unread-count', notificationController.unreadCount)
router.patch('/read-all', notificationController.markAllRead)
router.patch('/:id/read', validation(notificationIdSchema), notificationController.markRead)
router.delete('/:id', validation(notificationIdSchema), notificationController.remove)

export default router