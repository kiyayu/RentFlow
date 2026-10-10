//src/features/auth/types/auth.types.ts
export type SessionUser = {
  id: string
  name: string
  email: string
  emailVerified: boolean
  role: string
  createdAt: string
   avatarUrl?: string
}

export type DeviceSession = {
  id: string
  device: string
  ip?: string
  createdAt: string
  lastActive?: string
  current?: boolean
}