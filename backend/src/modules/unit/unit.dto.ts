//src/modules/unit/unit.dto.ts
import { z } from 'zod'

import {
  createUnitSchema,
  listUnitsSchema,
  unitIdSchema,
  updateUnitSchema,
} from './unit.validation.js'

import {
  UNIT_CONDITIONS,
  UNIT_CUSTODY_STATUSES,
  UNIT_OPERATIONAL_STATUSES,
} from './unit.constants.js'

export type CreateUnitDTO = z.infer<typeof createUnitSchema>['body']
export type UpdateUnitDTO = z.infer<typeof updateUnitSchema>['body']
export type UnitIdDTO = z.infer<typeof unitIdSchema>['params']
export type ListUnitsDTO = z.infer<typeof listUnitsSchema>['query']

export type UnitResponseDTO = {
  id: string
  productId: string
  assetTag: string
  serialNumber?: string
  condition: (typeof UNIT_CONDITIONS)[number]
  operationalStatus: (typeof UNIT_OPERATIONAL_STATUSES)[number]
  custodyStatus: (typeof UNIT_CUSTODY_STATUSES)[number]
  notes?: string
  createdAt: Date
  updatedAt: Date
}
