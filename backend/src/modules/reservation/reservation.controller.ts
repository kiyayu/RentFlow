//src/modules/reservation/reservation.controller.ts
import type { Request, Response } from 'express'

import { sendSuccess } from '../../common/handlers/responseHandler.js'

import type {
  CreateReservationDTO,
  ListReservationsDTO,
  ReservationIdDTO,
  UpdateReservationStatusDTO,
} from './reservation.dto.js'

import { reservationService } from './reservation.service.js'

export const reservationController = {
  create: async (req: Request, res: Response) => {
    const reservation = await reservationService.create(
      req.user!.id,
      req.data?.body as CreateReservationDTO,
    )

    return sendSuccess({
      res,
      data: reservation,
      message: 'Reservation created',
      statusCode: 201,
    })
  },

  listMine: async (req: Request, res: Response) => {
    const { reservations, pagination } =
      await reservationService.listMine(
        req.user!.id,
        req.data?.query as ListReservationsDTO,
      )

    return sendSuccess({
      res,
      data: reservations,
      pagination,
      message: 'Reservations retrieved',
    })
  },

  listOperations: async (req: Request, res: Response) => {
    const { reservations, pagination } =
      await reservationService.listOperations(
        req.data?.query as ListReservationsDTO,
      )

    return sendSuccess({
      res,
      data: reservations,
      pagination,
      message: 'Reservation operations retrieved',
    })
  },

  simulatePayment: async (req: Request, res: Response) => {
    const { id } = req.data?.params as ReservationIdDTO

    const reservation = await reservationService.simulatePayment(
      req.user!.id,
      id,
    )

    return sendSuccess({
      res,
      data: reservation,
      message: 'Simulated payment confirmed',
    })
  },

  updateStatus: async (req: Request, res: Response) => {
    const { id } = req.data?.params as ReservationIdDTO

    const reservation = await reservationService.updateStatus(
      id,
      req.data?.body as UpdateReservationStatusDTO,
    )

    return sendSuccess({
      res,
      data: reservation,
      message: 'Reservation updated',
    })
  },
}
