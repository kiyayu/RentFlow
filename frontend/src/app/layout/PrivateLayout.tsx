//src/app/layout/PrivateLayout.tsx
import { useQuery } from '@tanstack/react-query'
import { AppShell } from '@/components/layout/AppShell'
import { sessionQueryOptions, useLogout } from '@/features/auth'
import { NotificationBell } from '@/features/notifications'

export default function PrivateLayout() {
  const { data: user } = useQuery(sessionQueryOptions)
  const { mutate: logout } = useLogout()

  return (
    <AppShell
      user={user ?? undefined}
      onLogout={() => logout()}
      notifications={<NotificationBell />}
    />
  )
}