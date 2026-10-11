//src/features/auth/components/SessionsList.tsx
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { getErrorMessage } from '@/lib/errors'
import { formatDateTime } from '@/lib/format'
import { useTranslation } from '@/lib/i18n'
import { useRevokeSession, useSessions } from '../hooks/useSessions'

export function SessionsList() {
  const { t } = useTranslation('settings')
  const { data: sessions, isPending, isError, refetch } = useSessions()
  const { mutate: revoke, isPending: isRevoking, variables } = useRevokeSession()

  if (isPending) {
    return (
      <div className="space-y-3">
        <Skeleton className="w-full h-16" />
        <Skeleton className="w-full h-16" />
      </div>
    )
  }

  if (isError && !sessions) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-destructive">{t('security.loadFailed')}</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          {t('actions.tryAgain', { ns: 'common' })}
        </Button>
      </div>
    )
  }

  if (!sessions?.length) {
    return <p className="text-sm text-muted-foreground">{t('security.empty')}</p>
  }

  return (
    <ul className="space-y-3">
      {sessions.map((s) => {
        const revoking = isRevoking && variables === s.id
        return (
          <li key={s.id}
            className="flex flex-col gap-3 p-4 border border-border rounded-lg sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                {s.device}
                {s.current && (
                  <span className="px-2 py-0.5 ml-2 text-xs text-primary bg-primary/10 rounded-lg">
                    {t('security.thisDevice')}
                  </span>
                )}
              </p>
              <p className="text-xs text-muted-foreground">
                {s.ip ? `${s.ip} · ` : ''}
                {t('security.lastActive', { date: formatDateTime(s.lastActive ?? s.createdAt) })}
              </p>
            </div>
            <Button variant="outline" size="sm" disabled={s.current || revoking}
              onClick={() =>
                revoke(s.id, {
                  onSuccess: () => toast.success(t('security.signedOut')),
                  onError: (e) => toast.error(getErrorMessage(e)),
                })
              }>
              {revoking ? t('security.signingOut') : t('security.signOut')}
            </Button>
          </li>
        )
      })}
    </ul>
  )
}