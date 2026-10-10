//src/modules/notification/notification.controller.ts
import { Request, Response } from 'express'
import { sendSuccess } from '../../common/handlers/responseHandler.js'
import { asyncHandler } from '../../common/middlewares/asyncHandler.js'
import { notificationService } from './notification.service.js'
import type { ListNotificationsDTO, NotificationIdDTO } from './notification.dto.js'

export const notificationController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const query = (req.data?.query ?? {}) as ListNotificationsDTO
    const { items, pagination } = await notificationService.list(req.user!.id, query)
    return sendSuccess({ res, data: items, pagination, message: 'Notifications retrieved' })
  }),

  unreadCount: asyncHandler(async (req: Request, res: Response) => {
    const count = await notificationService.unreadCount(req.user!.id)
    return sendSuccess({ res, data: { count }, message: 'Unread count retrieved' })
  }),

  markRead: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.data?.params as NotificationIdDTO
    const data = await notificationService.markRead(req.user!.id, id)
    return sendSuccess({ res, data, message: 'Notification marked as read' })
  }),

  markAllRead: asyncHandler(async (req: Request, res: Response) => {
    const updated = await notificationService.markAllRead(req.user!.id)
    return sendSuccess({ res, data: { updated }, message: 'All notifications marked as read' })
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.data?.params as NotificationIdDTO
    await notificationService.remove(req.user!.id, id)
    return sendSuccess({ res, message: 'Notification deleted' })
  }),
}