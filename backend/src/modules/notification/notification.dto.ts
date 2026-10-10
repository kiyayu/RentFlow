//src/modules/notification/notification.dto.ts
import { z } from 'zod'
import { listNotificationsSchema, notificationIdSchema } from './notification.validation.js'
import { NotificationMeta, NotificationType } from './notification.constants.js'

export type ListNotificationsDTO = z.infer<typeof listNotificationsSchema>['query']
export type NotificationIdDTO = z.infer<typeof notificationIdSchema>['params']

export interface NotificationResponseDTO {
  id: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  createdAt: Date
}

export type NotifyInput = {
  userId: string
  type: NotificationType
  emailTo: string          // for email_changed, pass the OLD address
  name: string
  meta?: NotificationMeta
}