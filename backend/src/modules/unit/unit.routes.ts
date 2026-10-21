//src/modules/unit/unit.routes.ts
import express from 'express'

import { asyncHandler } from '../../common/middlewares/asyncHandler.js'
import { authenticate } from '../../common/middlewares/authMiddleware.js'
import { requireRole } from '../../common/middlewares/requireRole.js'
import { validation } from '../../common/middlewares/validation.js'

import { ROLES } from '../user/user.constants.js'

import { unitController } from './unit.controller.js'

import {
  createUnitSchema,
  listUnitsSchema,
  unitIdSchema,
  updateUnitSchema,
} from './unit.validation.js'

const router = express.Router()

router.use(authenticate, requireRole(ROLES.staffLevelRoles))

router.get(
  '/',
  validation(listUnitsSchema),
  asyncHandler(unitController.list),
)

router.post(
  '/',
  validation(createUnitSchema),
  asyncHandler(unitController.create),
)

router.post(
  '/:id/ready',
  validation(unitIdSchema),
  asyncHandler(unitController.markReady),
)

router.patch(
  '/:id',
  validation(updateUnitSchema),
  asyncHandler(unitController.update),
)

router.delete(
  '/:id',
  validation(unitIdSchema),
  asyncHandler(unitController.retire),
)

export default router
