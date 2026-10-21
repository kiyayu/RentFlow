//src/modules/unit/unit.validation.ts
import { z } from 'zod'

import {
  MAX_UNIT_PAGE_SIZE,
  UNIT_CONDITIONS,
  UNIT_OPERATIONAL_STATUSES,
} from './unit.constants.js'

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id')

const assetTag = z
  .string()
  .trim()
  .min(2, 'Asset tag must contain at least 2 characters')
  .max(80, 'Asset tag cannot exceed 80 characters')
  .regex(
    /^[a-zA-Z0-9-]+$/,
    'Asset tag may contain only letters, numbers, and hyphens',
  )
  .transform((value) => value.toUpperCase())

const serialNumber = z.string().trim().min(1).max(120)
const notes = z.string().trim().max(2000)

export const createUnitSchema = z.object({
  body: z
    .object({
      productId: objectId,
      assetTag,
      serialNumber: serialNumber.optional(),
      condition: z.enum(UNIT_CONDITIONS).optional(),
      notes: notes.optional(),
    })
    .strict(),
})

export const updateUnitSchema = z.object({
  params: z.object({ id: objectId }).strict(),
  body: z
    .object({
      serialNumber: serialNumber.nullable().optional(),
      condition: z.enum(UNIT_CONDITIONS).optional(),
      operationalStatus: z.enum(UNIT_OPERATIONAL_STATUSES).optional(),
      notes: notes.nullable().optional(),
    })
    .strict()
    .refine(
      (body) => Object.keys(body).length > 0,
      'At least one field is required',
    ),
})

export const unitIdSchema = z.object({
  params: z.object({ id: objectId }).strict(),
})

export const listUnitsSchema = z.object({
  query: z
    .object({
      productId: objectId.optional(),
      page: z.coerce.number().int().min(1).optional(),
      limit: z.coerce
        .number()
        .int()
        .min(1)
        .max(MAX_UNIT_PAGE_SIZE)
        .optional(),
    })
    .strict(),
})
