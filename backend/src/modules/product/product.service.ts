//src/modules/product/product.service.ts
import { ApiError } from '../../common/errors/apiErrors.js'

import {
  DEFAULT_PRODUCT_PAGE_SIZE,
} from './product.constants.js'

import type {
  CreateProductDTO,
  ListProductsDTO,
  ProductResponseDTO,
  UpdateProductDTO,
} from './product.dto.js'

import {
  Product,
  type IProduct,
} from './product.model.js'

const toSlug = (name: string): string =>
  name
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const mapResponse = (
  product: IProduct,
): ProductResponseDTO => ({
  id: product._id.toString(),
  name: product.name,
  slug: product.slug,
  description: product.description,
  brand: product.brand ?? undefined,
  images: product.images,
  specifications: Object.fromEntries(
    product.specifications.entries(),
  ),
  rentalPricing: {
    amount: product.rentalPricing.amount,
    currency: product.rentalPricing.currency,
    billingUnit: product.rentalPricing.billingUnit,
  },
  status: product.status,
  createdAt: product.createdAt,
  updatedAt: product.updatedAt,
})

const isDuplicateKeyError = (
  error: unknown,
): boolean =>
  typeof error === 'object' &&
  error !== null &&
  'code' in error &&
  error.code === 11000

const throwSlugConflict = (): never => {
  throw ApiError.conflict(
    'A product with this slug already exists',
  )
}

const ensureSlugAvailable = async (
  slug: string,
  productId?: string,
): Promise<void> => {
  const filter: Record<string, unknown> = { slug }

  if (productId) {
    filter._id = { $ne: productId }
  }

  const existingProduct = await Product.exists(filter)

  if (existingProduct) {
    throwSlugConflict()
  }
}

const buildPagination = (
  total: number,
  page: number,
  limit: number,
) => ({
  total,
  totalPage: Math.ceil(total / limit),
  currentPage: page,
})

export const productService = {
  create: async (
    userId: string,
    data: CreateProductDTO,
  ): Promise<ProductResponseDTO> => {
    const slug = toSlug(data.name)

    if (!slug) {
      throw ApiError.badRequest(
        'Product name must contain letters or numbers',
      )
    }

    await ensureSlugAvailable(slug)

    try {
      const product = await Product.create({
        ...data,
        slug,
        createdBy: userId,
      })

      return mapResponse(product)
    } catch (error) {
      // The pre-check improves the message, but the unique index
      // is the final authority when requests race.
      if (isDuplicateKeyError(error)) {
        throwSlugConflict()
      }

      throw error
    }
  },

  list: async (query: ListProductsDTO) => {
    const page = query.page ?? 1
    const limit = query.limit ?? DEFAULT_PRODUCT_PAGE_SIZE
    const filter = { status: 'active' as const }

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort({ createdAt: -1, _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit),

      Product.countDocuments(filter),
    ])

    return {
      products: products.map(mapResponse),
      pagination: buildPagination(total, page, limit),
    }
  },

  listManaged: async (query: ListProductsDTO) => {
    const page = query.page ?? 1
    const limit = query.limit ?? DEFAULT_PRODUCT_PAGE_SIZE

    const [products, total] = await Promise.all([
      Product.find({})
        .sort({ createdAt: -1, _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit),

      Product.countDocuments({}),
    ])

    return {
      products: products.map(mapResponse),
      pagination: buildPagination(total, page, limit),
    }
  },

  getBySlug: async (
    slug: string,
  ): Promise<ProductResponseDTO> => {
    const product = await Product.findOne({
      slug,
      status: 'active',
    })

    if (!product) {
      throw ApiError.notFound('Product not found')
    }

    return mapResponse(product)
  },

  update: async (
    id: string,
    data: UpdateProductDTO,
  ): Promise<ProductResponseDTO> => {
    const product = await Product.findById(id)

    if (!product) {
      throw ApiError.notFound('Product not found')
    }

    if (data.name !== undefined) {
      const slug = toSlug(data.name)

      if (!slug) {
        throw ApiError.badRequest(
          'Product name must contain letters or numbers',
        )
      }

      await ensureSlugAvailable(slug, id)

      product.name = data.name
      product.slug = slug
    }

    if (data.description !== undefined) {
      product.description = data.description
    }

    if (data.brand !== undefined) {
      product.brand = data.brand ?? undefined
    }

    if (data.images !== undefined) {
      product.images = data.images
    }

    if (data.specifications !== undefined) {
      product.specifications = new Map(
        Object.entries(data.specifications),
      )
    }

    if (data.rentalPricing !== undefined) {
      product.rentalPricing = data.rentalPricing
    }

    if (data.status !== undefined) {
      product.status = data.status
    }

    try {
      await product.save()
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        throwSlugConflict()
      }

      throw error
    }

    return mapResponse(product)
  },

  archive: async (id: string): Promise<void> => {
    const product = await Product.findById(id)

    if (!product) {
      throw ApiError.notFound('Product not found')
    }

    if (product.status === 'archived') {
      return
    }

    product.status = 'archived'
    await product.save()
  },
}