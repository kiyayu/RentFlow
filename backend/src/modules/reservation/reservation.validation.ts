//src/modules/reservation/reservatin.validation.ts
import { z } from 'zod'

import {
  MAX_RESERVATION_ITEM_QUANTITY,
  MAX_RESERVATION_ITEMS,
  MAX_RESERVATION_PAGE_SIZE,
} from './reservation.constants.js'

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id')

const date = z
  .string()
  .datetime({ offset: true })
  .transform((value) => new Date(value))

export const createReservationSchema = z.object({
  body: z
    .object({
      items: z
        .array(
          z
            .object({
              productId: objectId,
              quantity: z
                .number()
                .int()
                .min(1)
                .max(MAX_RESERVATION_ITEM_QUANTITY),
            })
            .strict(),
        )
        .min(1)
        .max(MAX_RESERVATION_ITEMS),
      startAt: date,
      endAt: date,
    })
    .strict()
    .superRefine((body, context) => {
      if (body.startAt >= body.endAt) {
        context.addIssue({
          code: 'custom',
          path: ['endAt'],
          message: 'End time must be after start time',
        })
      }

      if (body.startAt <= new Date()) {
        context.addIssue({
          code: 'custom',
          path: ['startAt'],
          message: 'Start time must be in the future',
        })
      }

      const productIds = new Set<string>()

      body.items.forEach((item, index) => {
        if (productIds.has(item.productId)) {
          context.addIssue({
            code: 'custom',
            path: ['items', index, 'productId'],
            message: 'Each product may appear only once',
          })
        }

        productIds.add(item.productId)
      })
    }),
})

export const reservationIdSchema = z.object({
  params: z.object({ id: objectId }).strict(),
})

export const updateReservationStatusSchema = z.object({
  params: z.object({ id: objectId }).strict(),
  body: z
    .object({
      status: z.enum(['checked_out', 'cancelled', 'completed']),
      returnCondition: z.enum(['good', 'damaged']).optional(),
      returnNotes: z.string().trim().max(2000).optional(),
    })
    .strict()
    .superRefine((body, context) => {
      if (body.status === 'completed' && !body.returnCondition) {
        context.addIssue({
          code: 'custom',
          path: ['returnCondition'],
          message: 'Return condition is required when completing a reservation',
        })
      }

      if (
        body.status !== 'completed' &&
        (body.returnCondition !== undefined || body.returnNotes !== undefined)
      ) {
        context.addIssue({
          code: 'custom',
          path: ['returnCondition'],
          message: 'Return details are only allowed when completing a reservation',
        })
      }
    }),
})

export const listReservationsSchema = z.object({
  query: z
    .object({
      page: z.coerce.number().int().min(1).optional(),
      limit: z.coerce.number().int().min(1).max(MAX_RESERVATION_PAGE_SIZE).optional(),
    })
    .strict(),
})
