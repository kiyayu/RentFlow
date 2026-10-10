//src/features/notifications/components/NotificationItem.tsx
import { ShieldAlert, KeyRound, Mail, Trash2, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { AppNotification, NotificationType } from '../types/notification.types'

const icons: Record<NotificationType, LucideIcon> = {
  password_changed: KeyRound,
  email_changed: Mail,
  new_sign_in: ShieldAlert,
}

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso))

export function NotificationItem({
  notification: n,
  onRead,
  onRemove,
  compact = false,
}: {
  notification: AppNotification
  onRead: (id: string) => void
  onRemove?: (id: string) => void
  compact?: boolean
}) {
  const Icon = icons[n.type] ?? ShieldAlert

  return (
    <li className={cn('flex gap-3 p-3', !n.read && 'bg-primary/5')}>
      <div className="flex items-center justify-center size-8 shrink-0 text-primary bg-primary/10 rounded-lg">
        <Icon className="size-4" />
      </div>
      <button
        type="button"
        className="flex-1 min-w-0 space-y-0.5 text-left"
        onClick={() => !n.read && onRead(n.id)}
      >
        <p className={cn('text-sm text-foreground', !n.read && 'font-medium')}>{n.title}</p>
        <p className={cn('text-xs text-muted-foreground', compact && 'line-clamp-2')}>{n.message}</p>
        <p className="text-xs text-muted-foreground">{formatDate(n.createdAt)}</p>
      </button>
      {onRemove && (
        <Button variant="ghost" size="icon" className="size-8" aria-label="Delete notification"
          onClick={() => onRemove(n.id)} icon={<Trash2 />} />
      )}
    </li>
  )
}