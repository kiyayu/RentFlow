//src/features/auth/components/SessionsList.tsx
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { getErrorMessage } from '@/lib/errors'
import { useRevokeSession, useSessions } from '../hooks/useSessions'

const formatDate = (iso?: string) =>
  iso
    ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso))
    : '—'

export function SessionsList() {
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
        <p className="text-sm text-destructive">Could not load your sessions.</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>Try again</Button>
      </div>
    )
  }

  if (!sessions?.length) {
    return <p className="text-sm text-muted-foreground">No active sessions.</p>
  }

  return (
    <ul className="space-y-3">
      {sessions.map((s) => (
        <li key={s.id}
          className="flex flex-col gap-3 p-4 border border-border rounded-lg sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              {s.device}
              {s.current && (
                <span className="px-2 py-0.5 ml-2 text-xs text-primary bg-primary/10 rounded-lg">
                  This device
                </span>
              )}
            </p>
            <p className="text-xs text-muted-foreground">
              {s.ip ? `${s.ip} · ` : ''}Last active {formatDate(s.lastActive ?? s.createdAt)}
            </p>
          </div>
          <Button variant="outline" size="sm"
            disabled={s.current || (isRevoking && variables === s.id)}
            onClick={() =>
              revoke(s.id, {
                onSuccess: () => toast.success('Session signed out'),
                onError: (e) => toast.error(getErrorMessage(e)),
              })
            }>
            {isRevoking && variables === s.id ? 'Signing out...' : 'Sign out'}
          </Button>
        </li>
      ))}
    </ul>
  )
}