//src/features/notifications/api/notification.api.ts
import { api } from '@/lib/axios'
import type { AppNotification, NotificationPage, NotificationQuery } from '../types/notification.types'

export const notificationApi = {
  list: async (query: NotificationQuery): Promise<NotificationPage> => {
    const res = await api.get<{ data: AppNotification[]; pagination: NotificationPage['pagination'] }>(
      '/notifications',
      { params: query }
    )
    return { items: res.data.data ?? [], pagination: res.data.pagination }
  },

  unreadCount: async (): Promise<number> => {
    const res = await api.get<{ data: { count: number } }>('/notifications/unread-count')
    return res.data.data.count
  },

  markRead: async (id: string): Promise<void> => {
    await api.patch(`/notifications/${id}/read`)
  },

  markAllRead: async (): Promise<void> => {
    await api.patch('/notifications/read-all')
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/notifications/${id}`)
  },
}