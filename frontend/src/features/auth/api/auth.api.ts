//src/features/auth/api/auth.api.ts
import { api } from '@/lib/axios'
import type { DeviceSession, SessionUser } from '../types/auth.types'
import type {
  LoginPayload,
  RegisterPayload,
  ForgotPasswordPayload,
} from '../schemas/auth.schema'

export const authApi = {
  getProfile: async (): Promise<SessionUser> => {
    const response = await api.get<{ data?: SessionUser }>('/user/profile')
    const user = response.data?.data
    if (!user?.id) throw new Error('The profile endpoint returned invalid data')
    return user
  },

  register: async (payload: RegisterPayload): Promise<SessionUser> => {
    const response = await api.post<{ data: SessionUser }>('/auth/register', payload)
    return response.data.data
  },

  login: async (payload: LoginPayload): Promise<SessionUser> => {
    const response = await api.post<{ data: SessionUser }>('/auth/login', payload)
    return response.data.data
  },

  verifyOtp: async (payload: { email: string; otp: string }): Promise<void> => {
    await api.post('/auth/verify-otp', payload)
  },

  resendOtp: async (payload: { email: string }): Promise<void> => {
    await api.post('/auth/resend-otp', payload)
  },

  forgotPassword: async (payload: ForgotPasswordPayload): Promise<void> => {
    await api.post('/auth/forgot-password', payload)
  },

  resetPassword: async (payload: { token: string; newPassword: string }): Promise<void> => {
    await api.post('/auth/reset-password', payload)
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout')
  },

  getSessions: async (): Promise<DeviceSession[]> => {
    const response = await api.get<{ data: DeviceSession[] }>('/auth/sessions')
    return response.data.data ?? []
  },

  revokeSession: async (familyId: string): Promise<void> => {
    await api.delete(`/auth/sessions/${familyId}`)
  },

  changePassword: async (payload: {
    currentPassword?: string
    newPassword: string
  }): Promise<void> => {
    await api.patch('/auth/change-password', payload)
  },
}