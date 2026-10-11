//src/features/notifications/components/NotificationBell.tsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { paths } from '@/config/paths'
import { useTranslation } from '@/lib/i18n'
import { useMarkAllRead, useMarkRead, useNotificationList, useUnreadCount } from '../hooks/useNotifications'
import { NotificationItem } from './NotificationItem'

export function NotificationBell() {
  const { t } = useTranslation('notifications')
  const [open, setOpen] = useState(false)
  const { data: count = 0 } = useUnreadCount()
  // fetched only while the menu is open
  const { data, isPending } = useNotificationList({ limit: 5 }, open)
  const markRead = useMarkRead()
  const markAll = useMarkAllRead()

  const label = count > 0 ? t('bellUnread', { count }) : t('bell')

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" className="relative" aria-label={label}
            icon={
              <>
                <Bell />
                {count > 0 && (
                  <span className="absolute top-1 right-1 flex items-center justify-center min-w-4 h-4 px-1 text-[10px] font-medium text-primary-foreground bg-destructive rounded-full">
                    {count > 99 ? '99+' : count}
                  </span>
                )}
              </>
            } />
        }
      />
      <DropdownMenuContent align="end" className="w-80 max-w-[calc(100vw-2rem)] p-0">
        <div className="flex items-center justify-between px-3 py-2 border-b border-border">
          <p className="text-sm font-medium text-foreground">{t('title')}</p>
          <Button variant="link" size="sm" className="h-auto p-0" disabled={count === 0 || markAll.isPending}
            onClick={() => markAll.mutate()}>
            {t('markAllRead')}
          </Button>
        </div>

        <ul className="overflow-y-auto divide-y divide-border max-h-80">
          {isPending && <li className="p-4 text-xs text-muted-foreground">{t('loading')}</li>}
          {data?.items.length === 0 && <li className="p-4 text-xs text-muted-foreground">{t('emptyShort')}</li>}
          {data?.items.map((n) => (
            <NotificationItem key={n.id} notification={n} compact onRead={(id) => markRead.mutate(id)} />
          ))}
        </ul>

        <div className="p-2 border-t border-border">
          <Link to={paths.settings.notifications} onClick={() => setOpen(false)}
            className="block py-1 text-sm text-center text-primary hover:underline">
            {t('viewAll')}
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}