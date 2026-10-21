//src/modules/reservation/reservation.dto.ts
import { z } from 'zod'

import {
  createReservationSchema,
  listReservationsSchema,
  reservationIdSchema,
  updateReservationStatusSchema,
} from './reservation.validation.js'

import { RESERVATION_STATUSES } from './reservation.constants.js'

export type CreateReservationDTO =
  z.infer<typeof createReservationSchema>['body']

export type ReservationIdDTO =
  z.infer<typeof reservationIdSchema>['params']

export type ListReservationsDTO =
  z.infer<typeof listReservationsSchema>['query']

export type UpdateReservationStatusDTO =
  z.infer<typeof updateReservationStatusSchema>['body']

export type ReservationResponseDTO = {
  id: string
  reservationNumber: string
  items: {
    productId: string
    productNameSnapshot: string
    quantity: number
    unitPrice: number
    lineTotal: number
  }[]
  startAt: Date
  endAt: Date
  status: (typeof RESERVATION_STATUSES)[number]
  holdExpiresAt?: Date
  pricing: {
    currency: 'ETB'
    subtotal: number
    securityDeposit: number
    totalDue: number
    paidTotal: number
    lateFee: number
  }
  paidAt?: Date
  createdAt: Date
  customer?: { id: string; name: string; email: string }
  assignedUnits: {
    id: string
    assetTag: string
    serialNumber?: string
    condition: string
  }[]
  returnInspection?: {
    condition: 'good' | 'damaged'
    notes?: string
    inspectedAt: Date
    lateFee: number
    depositReleased: boolean
  }
}
