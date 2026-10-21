//src/modules/unit/unit.controller.ts
import type { Request, Response } from 'express'

import { sendSuccess } from '../../common/handlers/responseHandler.js'

import type {
  CreateUnitDTO,
  ListUnitsDTO,
  UnitIdDTO,
  UpdateUnitDTO,
} from './unit.dto.js'

import { unitService } from './unit.service.js'

export const unitController = {
  create: async (req: Request, res: Response) => {
    const unit = await unitService.create(req.data?.body as CreateUnitDTO)

    return sendSuccess({
      res,
      data: unit,
      message: 'Unit created',
      statusCode: 201,
    })
  },

  list: async (req: Request, res: Response) => {
    const { units, pagination } = await unitService.list(
      req.data?.query as ListUnitsDTO,
    )

    return sendSuccess({
      res,
      data: units,
      pagination,
      message: 'Units retrieved',
    })
  },

  update: async (req: Request, res: Response) => {
    const { id } = req.data?.params as UnitIdDTO
    const unit = await unitService.update(
      id,
      req.data?.body as UpdateUnitDTO,
    )

    return sendSuccess({
      res,
      data: unit,
      message: 'Unit updated',
    })
  },

  markReady: async (req: Request, res: Response) => {
    const { id } = req.data?.params as UnitIdDTO
    const unit = await unitService.markReady(id)

    return sendSuccess({
      res,
      data: unit,
      message: 'Unit marked ready for rental',
    })
  },

  retire: async (req: Request, res: Response) => {
    const { id } = req.data?.params as UnitIdDTO
    await unitService.retire(id)

    return sendSuccess({
      res,
      message: 'Unit retired',
    })
  },
}
