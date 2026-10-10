//src/features/auth/hooks/useLogout.ts
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { authApi } from '../api/auth.api'
import { clearSession } from '../session-expiry'

export const useLogout = () =>
  useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => clearSession({ returnToCurrentPage: false }),
    onError: () => toast.error('Could not log out. Please try again.'),
  })