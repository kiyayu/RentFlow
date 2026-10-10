//src/config/paths.ts
export const paths = {
  home: "/",
  contact: "/contact",
  terms: "/terms",
  privacy: "/privacy",
  login: "/login",
  register: "/register",
  verifyEmail: "/verify-email",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  price:'price',
  
  app: {
    root: "/app",
    dashboard: "/app/dashboard",
     
  },
  settings: {
    root: "/app/settings",
    profile: "/app/settings/profile",
    preferences: "/app/settings/preferences",
    notifications: "/app/settings/notifications",
    account: "/app/settings/account",
    security: "/app/settings/security",
    privacy: "/app/settings/privacy",
  },
} as const