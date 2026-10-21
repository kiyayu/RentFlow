//src/modules/product/product.dto.ts
import { z } from 'zod'

import {
  createProductSchema,
  listProductsSchema,
  productIdSchema,
  productSlugSchema,
  updateProductSchema,
} from './product.validation.js'

export type CreateProductDTO =
  z.infer<typeof createProductSchema>['body']

export type UpdateProductDTO =
  z.infer<typeof updateProductSchema>['body']

export type ProductIdDTO =
  z.infer<typeof productIdSchema>['params']

export type ProductSlugDTO =
  z.infer<typeof productSlugSchema>['params']

export type ListProductsDTO =
  z.infer<typeof listProductsSchema>['query']

export type ProductResponseDTO = {
  id: string
  name: string
  slug: string
  description: string
  brand?: string
  images: string[]
  specifications: Record<string, string>
  rentalPricing: {
    amount: number
    currency: 'ETB'
    billingUnit: 'day'
  }
  status: 'active' | 'archived'
  createdAt: Date
  updatedAt: Date
}