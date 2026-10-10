//src/features/auth/hooks/useSessions.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authApi } from '../api/auth.api'
import { authKeys } from '../auth-session'

export const useSessions = () =>
  useQuery({ queryKey: authKeys.sessions, queryFn: authApi.getSessions })

export const useRevokeSession = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: authApi.revokeSession,
    onSettled: () => queryClient.invalidateQueries({ queryKey: authKeys.sessions }),
  })
}

export const useChangePassword = () =>
  useMutation({ mutationFn: authApi.changePassword })