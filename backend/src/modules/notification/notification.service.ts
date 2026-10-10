//src/modules/notification/notification.service.ts
import { Types } from 'mongoose'
import { ApiError } from '../../common/errors/apiErrors.js'
import { logger } from '../../common/utils/logger.js'
import { notificationQueue } from '../../queues/notification.queue.js'
import { Notification } from './notification.model.js'
import {
  NOTIFICATION_CATALOG,
  NOTIFICATION_DEFAULT_PAGE_SIZE,
} from './notification.constants.js'
import type { ListNotificationsDTO, NotificationResponseDTO, NotifyInput } from './notification.dto.js'

const mapResponse = (n: any): NotificationResponseDTO => ({
  id: n._id.toString(),
  type: n.type,
  title: n.title,
  message: n.message,
  read: !!n.readAt,
  createdAt: n.createdAt,
})

export const notificationService = {
  // Called by other modules. NEVER throws: the main action already succeeded.
  notify: async (input: NotifyInput): Promise<void> => {
    try {
      const entry = NOTIFICATION_CATALOG[input.type]
      const message = entry.message(input.meta ?? {})

      const doc = await Notification.create({
        userId: input.userId,
        type: input.type,
        title: entry.title,
        message,
      })

      if (entry.email) {
        // jobId = notification id, so a retry can never send the same email twice
        await notificationQueue.add(
          'send',
          { to: input.emailTo, name: input.name, subject: entry.title, message },
          { jobId: doc.id }
        )
      }
    } catch (err) {
      logger.error({ err, type: input.type, userId: input.userId }, 'notify failed')
    }
  },

  list: async (userId: string, query: ListNotificationsDTO) => {
    const page = query.page ?? 1
    const limit = query.limit ?? NOTIFICATION_DEFAULT_PAGE_SIZE
    const filter: Record<string, unknown> = { userId }
    if (query.unreadOnly) filter.readAt = null

    const [items, total] = await Promise.all([
      Notification.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Notification.countDocuments(filter),
    ])

    return {
      items: items.map(mapResponse),
      pagination: { total, totalPage: Math.ceil(total / limit), currentPage: page },
    }
  },

  unreadCount: async (userId: string): Promise<number> =>
    Notification.countDocuments({ userId, readAt: null }),

  markRead: async (userId: string, id: string): Promise<NotificationResponseDTO> => {
    const doc = await Notification.findOneAndUpdate(
      { _id: new Types.ObjectId(id), userId },        // userId in the filter = ownership check
      { $set: { readAt: new Date() } },
      { new: true }
    )
    if (!doc) throw ApiError.notFound('Notification not found')
    return mapResponse(doc)
  },

  markAllRead: async (userId: string): Promise<number> => {
    const result = await Notification.updateMany({ userId, readAt: null }, { $set: { readAt: new Date() } })
    return result.modifiedCount
  },

  remove: async (userId: string, id: string): Promise<void> => {
    const doc = await Notification.findOneAndDelete({ _id: new Types.ObjectId(id), userId })
    if (!doc) throw ApiError.notFound('Notification not found')
  },
}