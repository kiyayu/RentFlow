//src/modules/reservation/reservation.routes.ts
import express from 'express'

import { asyncHandler } from '../../common/middlewares/asyncHandler.js'
import { authenticate } from '../../common/middlewares/authMiddleware.js'
import { requireRole } from '../../common/middlewares/requireRole.js'
import { validation } from '../../common/middlewares/validation.js'

import { ROLES } from '../user/user.constants.js'

import { reservationController } from './reservation.controller.js'

import {
  createReservationSchema,
  listReservationsSchema,
  reservationIdSchema,
  updateReservationStatusSchema,
} from './reservation.validation.js'

const router = express.Router()

router.use(authenticate)

router.get(
  '/manage',
  requireRole(ROLES.staffLevelRoles),
  validation(listReservationsSchema),
  asyncHandler(reservationController.listOperations),
)

router.get(
  '/',
  validation(listReservationsSchema),
  asyncHandler(reservationController.listMine),
)

router.post(
  '/',
  validation(createReservationSchema),
  asyncHandler(reservationController.create),
)

// Development/testing only. The service rejects this route in production.
router.post(
  '/:id/payment/simulate',
  validation(reservationIdSchema),
  asyncHandler(reservationController.simulatePayment),
)

router.patch(
  '/:id/status',
  requireRole(ROLES.staffLevelRoles),
  validation(updateReservationStatusSchema),
  asyncHandler(reservationController.updateStatus),
)

export default router

