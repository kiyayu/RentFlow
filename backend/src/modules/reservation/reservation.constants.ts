//src/modules/reservtion/reservation.constants.ts
export const RESERVATION_STATUSES = [
  'pending_payment',
  'confirmed',
  'checked_out',
  'cancelled',
  'expired',
  'completed',
] as const

export const ALLOCATION_STATUSES = ['held', 'confirmed', 'released'] as const

export const ACTIVE_ALLOCATION_STATUSES = ['held', 'confirmed'] as const

export const RESERVATION_HOLD_MS = 30 * 60 * 1000

 
export const SECURITY_DEPOSIT_RATE = 0.5
export const LATE_FEE_DAILY_RATE = 0.2

export const DEFAULT_CUSTOMER_RESERVATION_PAGE_SIZE = 20
export const DEFAULT_OPERATIONS_RESERVATION_PAGE_SIZE = 50
export const MAX_RESERVATION_PAGE_SIZE = 100
export const MAX_RESERVATION_ITEMS = 20
export const MAX_RESERVATION_ITEM_QUANTITY = 20
export const EXPIRED_RESERVATION_SWEEP_BATCH_SIZE = 100

export const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000
