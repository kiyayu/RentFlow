//src/features/notifications/hooks/useNotifications.ts
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notificationApi } from '../api/notification.api'
import type { NotificationQuery } from '../types/notification.types'

export const notificationKeys = {
  all: ['notifications'] as const,
  list: (q: NotificationQuery) => ['notifications', 'list', q] as const,
  unread: ['notifications', 'unread'] as const,
}

export const useNotificationList = (query: NotificationQuery, enabled = true) =>
  useQuery({
    queryKey: notificationKeys.list(query),
    queryFn: () => notificationApi.list(query),
    placeholderData: keepPreviousData,
    enabled,
  })

// Polls every 60s. React Query pauses interval refetching while the tab is hidden
// unless refetchIntervalInBackground is set, so hidden tabs cost nothing.
export const useUnreadCount = () =>
  useQuery({
    queryKey: notificationKeys.unread,
    queryFn: notificationApi.unreadCount,
    refetchInterval: 60_000,
    staleTime: 30_000,
  })

const useInvalidatingMutation = <TVars,>(fn: (v: TVars) => Promise<void>) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: fn,
    // onSettled: even a 404 (already deleted elsewhere) must re-sync
    onSettled: () => queryClient.invalidateQueries({ queryKey: notificationKeys.all }),
  })
}

export const useMarkRead = () => useInvalidatingMutation(notificationApi.markRead)
export const useMarkAllRead = () => useInvalidatingMutation(() => notificationApi.markAllRead())
export const useRemoveNotification = () => useInvalidatingMutation(notificationApi.remove)