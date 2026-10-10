//src/app/router/PrivatePath.tsx
import { redirect, type RouteObject } from 'react-router-dom'
import { paths } from '@/config/paths'
import { settingsConfig } from '@/features/settings/settings.config'
import { ErrorPanel } from '@/components/layout/ErrorPanel'

const page = (load: () => Promise<{ default: React.ComponentType }>) => () =>
  load().then((m) => ({ Component: m.default }))

const notFound = () => {
  throw new Response('Not Found', { status: 404 })
}

export const PrivateRoute: RouteObject[] = [
  {
    errorElement: <ErrorPanel />,
    children: [
      { index: true, loader: () => redirect(paths.app.dashboard) },
      { path: 'dashboard', handle: { title: 'Dashboard' }, lazy: page(() => import('@/features/dashboard/Pages/Dashboard')) },
       
      {
        path: 'settings',
        lazy: page(() => import('@/features/settings/SettingsLayout')),
        children: [
          { index: true, loader: () => redirect(settingsConfig.defaultPath) },
          { path: 'profile', handle: { title: 'Profile' }, lazy: page(() => import('@/features/settings/pages/ProfilePage')) },
          { path: 'preferences', handle: { title: 'Preferences' }, lazy: page(() => import('@/features/settings/pages/PreferencesPage')) },
          { path: 'notifications', handle: { title: 'Notifications' }, lazy: page(() => import('@/features/settings/pages/NotificationsPage')) },
          { path: 'account', handle: { title: 'Account' }, lazy: page(() => import('@/features/settings/pages/AccountPage')) },
          { path: 'security', handle: { title: 'Security' }, lazy: page(() => import('@/features/settings/pages/SecurityPage')) },
          { path: 'privacy', handle: { title: 'Privacy & data' }, lazy: page(() => import('@/features/settings/pages/PrivacyPage')) },
        ],
      },
      { path: '*', loader: notFound },
    ],
  },
]