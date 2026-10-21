//src/modules/proudct/product.routes.ts
import express from 'express'

import { asyncHandler } from '../../common/middlewares/asyncHandler.js'
import { authenticate } from '../../common/middlewares/authMiddleware.js'
import { requireRole } from '../../common/middlewares/requireRole.js'
import { validation } from '../../common/middlewares/validation.js'

import { ROLES } from '../user/user.constants.js'

import { productController } from './product.controller.js'

import {
  createProductSchema,
  listProductsSchema,
  productIdSchema,
  productSlugSchema,
  updateProductSchema,
} from './product.validation.js'

const router = express.Router()

// Public catalog endpoints.
router.get(
  '/',
  validation(listProductsSchema),
  asyncHandler(productController.list),
)

router.get(
  '/manage',
  authenticate,
  requireRole(ROLES.staffLevelRoles),
  validation(listProductsSchema),
  asyncHandler(productController.listManaged),
)

router.get(
  '/:slug',
  validation(productSlugSchema),
  asyncHandler(productController.getBySlug),
)

// All management routes below this point require staff authorization.
router.use(
  authenticate,
  requireRole(ROLES.staffLevelRoles),
)

router.post(
  '/',
  validation(createProductSchema),
  asyncHandler(productController.create),
)

router.patch(
  '/:id',
  validation(updateProductSchema),
  asyncHandler(productController.update),
)

router.delete(
  '/:id',
  validation(productIdSchema),
  asyncHandler(productController.archive),
)

export default router
