//src/modules/notification/notification.validation.ts
import { z } from 'zod'
import { NOTIFICATION_MAX_PAGE_SIZE } from './notification.constants.js'

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid notification id')

export const listNotificationsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(NOTIFICATION_MAX_PAGE_SIZE).optional(),

    unreadOnly: z.enum(['true', 'false']).transform((v) => v === 'true').optional(),
  }).strict(),
})

export const notificationIdSchema = z.object({
  params: z.object({ id: objectId }).strict(),
})