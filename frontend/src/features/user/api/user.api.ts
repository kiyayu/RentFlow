//src/features/user/api/user.api.ts
import { api } from '@/lib/axios'
import type { SessionUser } from '@/features/auth'

export const userApi = {
  updateName: async (payload: { name: string }): Promise<SessionUser> => {
    const response = await api.put<{ data: SessionUser }>('/user/update', payload)
    return response.data.data
  },

  changeEmail: async (payload: { newEmail: string }): Promise<SessionUser | undefined> => {
    const response = await api.put<{ data?: SessionUser }>('/user/change-email', payload)
    return response.data?.data
  },
  deactivate: async (): Promise<void> => {
    await api.put('/user/deactivate')
  },

  hardDelete: async (): Promise<void> => {
    await api.put('/user/hard-delete')
  },
  setAvatar: async (fileKey: string): Promise<SessionUser> => {
    const res = await api.put<{ data: SessionUser }>('/user/avatar', { fileKey })
    return res.data.data
  },

  removeAvatar: async (): Promise<SessionUser> => {
    const res = await api.delete<{ data: SessionUser }>('/user/avatar')
    return res.data.data
  },
}