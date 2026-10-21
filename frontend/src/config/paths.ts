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
  productCatalog: '/products',
  productDetail: (slug: string) => `/products/${slug}`,
  
  app: {
    root: "/app",
    dashboard: "/app/dashboard",
    createProduct: "/app/products/new",
    products: '/app/products',
    equipment: '/app/equipment',
    equipmentDetail: (slug: string) => `/app/equipment/${slug}`,
    reserveEquipment: (slug: string) => `/app/equipment/${slug}/reserve`,
    inventory: '/app/inventory',
    reservations: '/app/reservations',
     
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
