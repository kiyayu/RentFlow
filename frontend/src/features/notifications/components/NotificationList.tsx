//src/features/notifications/components/NotificationList.tsx
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { getErrorMessage } from '@/lib/errors'
import { useMarkAllRead, useMarkRead, useNotificationList, useRemoveNotification } from '../hooks/useNotifications'
import { NotificationItem } from './NotificationItem'

export function NotificationList() {
  const [page, setPage] = useState(1)
  const { data, isPending, isError, isPlaceholderData, refetch } = useNotificationList({ page, limit: 10 })
  const markRead = useMarkRead()
  const markAll = useMarkAllRead()
  const remove = useRemoveNotification()

  if (isPending) {
    return (
      <div className="space-y-3">
        <Skeleton className="w-full h-16" />
        <Skeleton className="w-full h-16" />
      </div>
    )
  }

  if (isError && !data) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-destructive">Could not load notifications.</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>Try again</Button>
      </div>
    )
  }

  if (!data?.items.length) {
    return <p className="text-sm text-muted-foreground">You have no notifications.</p>
  }

  const { items, pagination } = data
  const hasUnread = items.some((n) => !n.read)

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" disabled={!hasUnread || markAll.isPending}
          onClick={() => markAll.mutate(undefined, { onError: (e) => toast.error(getErrorMessage(e)) })}>
          Mark all as read
        </Button>
      </div>

      <ul className={`border border-border rounded-lg divide-y divide-border overflow-hidden ${isPlaceholderData ? 'opacity-60' : ''}`}>
        {items.map((n) => (
          <NotificationItem key={n.id} notification={n}
            onRead={(id) => markRead.mutate(id)}
            onRemove={(id) => remove.mutate(id, { onError: (e) => toast.error(getErrorMessage(e)) })} />
        ))}
      </ul>

      {pagination.totalPage > 1 && (
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
          <span className="text-xs text-muted-foreground">Page {pagination.currentPage} of {pagination.totalPage}</span>
          <Button variant="outline" size="sm" disabled={page >= pagination.totalPage} onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      )}
    </div>
  )
}