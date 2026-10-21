//src/modules/unit/unit.constants.ts
export const UNIT_CONDITIONS = ['new', 'good', 'fair', 'damaged'] as const

export const UNIT_OPERATIONAL_STATUSES = ['available', 'maintenance', 'retired'] as const

export const UNIT_CUSTODY_STATUSES = ['in_stock', 'checked_out', 'inspection_required'] as const

export const DEFAULT_UNIT_PAGE_SIZE = 20

export const MAX_UNIT_PAGE_SIZE = 10
