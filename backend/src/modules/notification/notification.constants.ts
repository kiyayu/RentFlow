//src/modules/notification/notification.constants.ts
export const NOTIFICATION_TYPES = ['password_changed', 'email_changed', 'new_sign_in'] as const
export type NotificationType = (typeof NOTIFICATION_TYPES)[number]

export type NotificationMeta = { device?: string; ip?: string; newEmail?: string }

type CatalogEntry = {
  category: 'security'
  email: boolean
  title: string
  message: (meta: NotificationMeta) => string
}

// One place defines what each notification says. Adding a type = adding one entry.
export const NOTIFICATION_CATALOG: Record<NotificationType, CatalogEntry> = {
  password_changed: {
    category: 'security',
    email: true,
    title: 'Password changed',
    message: () =>
      'Your password was changed. If this was not you, reset your password immediately.',
  },
  email_changed: {
    category: 'security',
    email: true,
    title: 'Email address changed',
    message: (m) =>
      `Your account email was changed${m.newEmail ? ` to ${m.newEmail}` : ''}. If this was not you, contact support immediately.`,
  },
  new_sign_in: {
    category: 'security',
    email: true,
    title: 'New sign-in',
    message: (m) =>
      `Your account was signed in from ${m.device ?? 'an unknown device'}${m.ip ? ` (${m.ip})` : ''}. If this was not you, revoke the session and change your password.`,
  },
}

export const NOTIFICATION_TTL_SECONDS = 90 * 24 * 60 * 60
export const NOTIFICATION_DEFAULT_PAGE_SIZE = 20
export const NOTIFICATION_MAX_PAGE_SIZE = 50