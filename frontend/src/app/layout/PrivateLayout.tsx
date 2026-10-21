//src/app/layout/PrivateLayout.tsx
import { useQuery } from '@tanstack/react-query'
import { AppShell } from '@/components/layout/AppShell'
import { sessionQueryOptions, useLogout } from '@/features/auth'
import { NotificationBell } from '@/features/notifications'
import { adminWorkspaceConfig, customerWorkspaceConfig, staffWorkspaceConfig } from '@/components/layout/workspace.config'

export default function PrivateLayout() {
  const { data: user } = useQuery(sessionQueryOptions)
  const { mutate: logout } = useLogout()
  const config = user?.role === 'admin' ? adminWorkspaceConfig : user?.role === 'staff' ? staffWorkspaceConfig : customerWorkspaceConfig

  return (
    <AppShell
      user={user ?? undefined}
      onLogout={() => logout()}
      notifications={<NotificationBell />}
      config={config}
    />
  )
}
