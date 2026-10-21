//src/module/product/product.validation.ts
import { z } from 'zod'

import {
  BILLING_UNITS,
  MAX_PRODUCT_PAGE_SIZE,
  PRODUCT_STATUSES,
} from './product.constants.js'

const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'Invalid product id')

const productName = z
  .string()
  .trim()
  .min(2, 'Product name must contain at least 2 characters')
  .max(160, 'Product name cannot exceed 160 characters')

const productDescription = z
  .string()
  .trim()
  .min(10, 'Description must contain at least 10 characters')
  .max(5000, 'Description cannot exceed 5000 characters')

const brand = z
  .string()
  .trim()
  .min(1)
  .max(120)

const imageUrl = z
  .string()
  .url('Each image must be a valid URL')

const specificationsSchema = z.record(
  z.string().min(1).max(80),
  z.string().trim().min(1).max(500),
)

const pricingSchema = z
  .object({
    amount: z
      .number()
      .finite()
      .positive('Rental price must be greater than zero')
      .refine(
        (amount) =>
          Math.abs(amount - Math.round(amount * 100) / 100) < 1e-8,
        'Rental price can have at most two decimal places',
      ),

    currency: z.literal('ETB'),

    billingUnit: z.enum(BILLING_UNITS),
  })
  .strict()

export const createProductSchema = z.object({
  body: z
    .object({
      name: productName,
      description: productDescription,
      brand: brand.optional(),
      images: z.array(imageUrl).max(10).optional(),
      specifications: specificationsSchema.optional(),
      rentalPricing: pricingSchema,
    })
    .strict(),
})

export const updateProductSchema = z.object({
  params: z
    .object({
      id: objectId,
    })
    .strict(),

  body: z
    .object({
      name: productName.optional(),
      description: productDescription.optional(),
      brand: brand.nullable().optional(),
      images: z.array(imageUrl).max(10).optional(),
      specifications: specificationsSchema.optional(),
      rentalPricing: pricingSchema.optional(),
      status: z.enum(PRODUCT_STATUSES).optional(),
    })
    .strict()
    .refine(
      (body) => Object.keys(body).length > 0,
      'At least one field is required',
    ),
})

export const productIdSchema = z.object({
  params: z
    .object({
      id: objectId,
    })
    .strict(),
})

export const productSlugSchema = z.object({
  params: z
    .object({
      slug: z
        .string()
        .regex(
          /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
          'Invalid product slug',
        ),
    })
    .strict(),
})

export const listProductsSchema = z.object({
  query: z
    .object({
      page: z.coerce.number().int().min(1).optional(),
      limit: z.coerce
        .number()
        .int()
        .min(1)
        .max(MAX_PRODUCT_PAGE_SIZE)
        .optional(),
    })
    .strict(),
})