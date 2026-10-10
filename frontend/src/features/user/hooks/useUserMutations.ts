//src/features/user/hooks/useUserMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authKeys, clearSession } from '@/features/auth'
import { userApi } from '../api/user.api'

export const useUpdateName = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: userApi.updateName,
    // the server returned the exact user, so write it (no extra GET)
    onSuccess: (user) => queryClient.setQueryData(authKeys.session, user),
  })
}

export const useChangeEmail = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: userApi.changeEmail,
    onSuccess: (user) => {
      if (user) queryClient.setQueryData(authKeys.session, user)
      else queryClient.invalidateQueries({ queryKey: authKeys.session })
    },
  })
}

export const useDeactivateAccount = () =>
  useMutation({
    mutationFn: userApi.deactivate,
    onSuccess: () => clearSession({ returnToCurrentPage: false }),
  })

export const useDeleteAccount = () =>
  useMutation({
    mutationFn: userApi.hardDelete,
    onSuccess: () => clearSession({ returnToCurrentPage: false }),
  })

  export const useSetAvatar = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: userApi.setAvatar,
    onSuccess: (user) => queryClient.setQueryData(authKeys.session, user),
  })
}

export const useRemoveAvatar = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: userApi.removeAvatar,
    onSuccess: (user) => queryClient.setQueryData(authKeys.session, user),
  })
}