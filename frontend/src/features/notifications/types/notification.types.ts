//src/features/notifications/types/notification.types.ts
export type NotificationType = 'password_changed' | 'email_changed' | 'new_sign_in'

export type AppNotification = {
  id: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  createdAt: string
}

export type NotificationPage = {
  items: AppNotification[]
  pagination: { total: number; totalPage: number; currentPage: number }
}

export type NotificationQuery = { page?: number; limit?: number; unreadOnly?: boolean }