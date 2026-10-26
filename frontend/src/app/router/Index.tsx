// src/app/router/Index.tsx
import { createBrowserRouter, RouterProvider, redirect } from 'react-router-dom'
import RootBinaryController from '@/app/layout/RootBinaryController'
import { ErrorPage } from '@/components/layout/ErrorPage'
import { queryClient } from '@/lib/query.client'
import { sessionQueryOptions } from '@/features/auth'
import { paths } from '@/config/paths'
import { marketingRoutes, authRoutes, createAuthGuard, createHomeGuard } from './PublicPath'
import { PrivateRoute } from './PrivatePath'

const router = createBrowserRouter([
  {
    path: paths.home,
    Component: RootBinaryController,
    errorElement: <ErrorPage />,
    children: [
      {
        lazy: () =>
          import('@/components/layout/MarketingLayout').then((m) => ({
            Component: m.MarketingLayout,
          })),
        children: marketingRoutes.map((route) =>
          route.index ? { ...route, loader: createHomeGuard(queryClient) } : route,
        ),
      },
      {
        loader: createAuthGuard(queryClient),
        lazy: () =>
          import('@/components/layout/AuthLayout').then((m) => ({
            Component: m.AuthLayout,
          })),
        children: authRoutes,
      },
      {
        path: 'app',
        loader: async ({ request }) => {
          const cached = queryClient.getQueryData(sessionQueryOptions.queryKey)

          const user =
            cached !== undefined
              ? cached
              : await queryClient.ensureQueryData(sessionQueryOptions)

          if (!user) {
            const { pathname, search } = new URL(request.url)
            return redirect(
              `${paths.login}?redirect=${encodeURIComponent(pathname + search)}`
            )
          }

          return null
        },
        lazy: () =>
          import('@/app/layout/PrivateLayout').then((m) => ({
            Component: m.default,
          })),
        children: PrivateRoute,
      },
      // public unknown URLs only; /app/* unknowns are caught inside PrivateRoute
      {
        path: '*',
        loader: () => {
          throw new Response('Not Found', { status: 404 })
        },
      },
    ],
  },
])

export const AppRouter = () => <RouterProvider router={router} />
