//src/modules/product/product.controller.ts
import type { Request, Response } from 'express'

import { sendSuccess } from '../../common/handlers/responseHandler.js'

import type {
  CreateProductDTO,
  ListProductsDTO,
  ProductIdDTO,
  ProductSlugDTO,
  UpdateProductDTO,
} from './product.dto.js'

import { productService } from './product.service.js'

export const productController = {
  create: async (req: Request, res: Response) => {
    const data = req.data?.body as CreateProductDTO

    const product = await productService.create(
      req.user!.id,
      data,
    )

    return sendSuccess({
      res,
      data: product,
      message: 'Product created',
      statusCode: 201,
    })
  },

  list: async (req: Request, res: Response) => {
    const query = req.data?.query as ListProductsDTO

    const { products, pagination } =
      await productService.list(query)

    return sendSuccess({
      res,
      data: products,
      pagination,
      message: 'Products retrieved',
    })
  },

  listManaged: async (req: Request, res: Response) => {
    const query = req.data?.query as ListProductsDTO

    const { products, pagination } =
      await productService.listManaged(query)

    return sendSuccess({
      res,
      data: products,
      pagination,
      message: 'Products retrieved',
    })
  },

  getBySlug: async (req: Request, res: Response) => {
    const { slug } = req.data?.params as ProductSlugDTO

    const product = await productService.getBySlug(slug)

    return sendSuccess({
      res,
      data: product,
      message: 'Product retrieved',
    })
  },

  update: async (req: Request, res: Response) => {
    const { id } = req.data?.params as ProductIdDTO
    const data = req.data?.body as UpdateProductDTO

    const product = await productService.update(id, data)

    return sendSuccess({
      res,
      data: product,
      message: 'Product updated',
    })
  },

  archive: async (req: Request, res: Response) => {
    const { id } = req.data?.params as ProductIdDTO

    await productService.archive(id)

    return sendSuccess({
      res,
      message: 'Product archived',
    })
  },
}