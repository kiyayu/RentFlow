//src/features/notifications/components/NotificationList.tsx
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { getErrorMessage } from '@/lib/errors'
import { useTranslation } from '@/lib/i18n'
import { useMarkAllRead, useMarkRead, useNotificationList, useRemoveNotification } from '../hooks/useNotifications'
import { NotificationItem } from './NotificationItem'

export function NotificationList() {
  const { t } = useTranslation('notifications')
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
        <p className="text-sm text-destructive">{t('loadFailed')}</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          {t('actions.tryAgain', { ns: 'common' })}
        </Button>
      </div>
    )
  }

  if (!data?.items.length) {
    return <p className="text-sm text-muted-foreground">{t('empty')}</p>
  }

  const { items, pagination } = data
  const hasUnread = items.some((n) => !n.read)

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" disabled={!hasUnread || markAll.isPending}
          onClick={() => markAll.mutate(undefined, { onError: (e) => toast.error(getErrorMessage(e)) })}>
          {t('markAllReadLong')}
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
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            {t('previous')}
          </Button>
          <span className="text-xs text-muted-foreground">
            {t('pageOf', { current: pagination.currentPage, total: pagination.totalPage })}
          </span>
          <Button variant="outline" size="sm" disabled={page >= pagination.totalPage} onClick={() => setPage((p) => p + 1)}>
            {t('next')}
          </Button>
        </div>
      )}
    </div>
  )
}