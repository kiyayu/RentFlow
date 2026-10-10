//src/modules/user/user.constants.ts
export const USER_ROLES = ['customer', 'staff', 'admin'] as const;
export const ROLES = {
    staffLevelRoles:['staff', 'admin'],
    customerLevelRoles:['customer']
}

export const EMAIL_CHANGE_OTP_TTL_MS = 5 * 60 * 1000
export const EMAIL_CHANGE_OTP_COOLDOWN_MS = 60 * 1000
export const EMAIL_CHANGE_OTP_MAX_ATTEMPTS = 5
 
export const DEFAULT_PAGE_SIZE = 20
export const MAX_PAGE_SIZE = 100
 