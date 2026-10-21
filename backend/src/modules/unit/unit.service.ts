//src/modules/unit/unit.service.ts
import mongoose, { Types, type ClientSession } from 'mongoose'

import { ApiError } from '../../common/errors/apiErrors.js'
import { Product } from '../product/product.model.js'
import { UnitAllocation } from '../reservation/reservation.model.js'
import { DEFAULT_UNIT_PAGE_SIZE } from './unit.constants.js'
import type {
  CreateUnitDTO,
  ListUnitsDTO,
  UnitResponseDTO,
  UpdateUnitDTO,
} from './unit.dto.js'
import { Unit, type IUnit } from './unit.model.js'

const mapResponse = (unit: IUnit): UnitResponseDTO => ({
  id: unit._id.toString(),
  productId: unit.productId.toString(),
  assetTag: unit.assetTag,
  serialNumber: unit.serialNumber ?? undefined,
  condition: unit.condition,
  operationalStatus: unit.operationalStatus,
  custodyStatus: unit.custodyStatus,
  notes: unit.notes ?? undefined,
  createdAt: unit.createdAt,
  updatedAt: unit.updatedAt,
})

const isDuplicateKeyError = (error: unknown): boolean =>
  typeof error === 'object' &&
  error !== null &&
  'code' in error &&
  error.code === 11000

const getDuplicateKey = (error: unknown): string | undefined => {
  if (typeof error !== 'object' || error === null || !('keyPattern' in error)) {
    return undefined
  }

  const keyPattern = error.keyPattern
  if (typeof keyPattern !== 'object' || keyPattern === null) {
    return undefined
  }

  if ('assetTag' in keyPattern) return 'assetTag'
  if ('serialNumber' in keyPattern) return 'serialNumber'
  return undefined
}

const throwDuplicateKeyConflict = (error: unknown): never => {
  const key = getDuplicateKey(error)

  if (key === 'assetTag') {
    throw ApiError.conflict('Asset tag is already in use')
  }

  if (key === 'serialNumber') {
    throw ApiError.conflict('Serial number is already in use')
  }

  throw ApiError.conflict('A Unit with one of these unique values already exists')
}

/**
 * A confirmed allocation blocks maintenance and retirement until the
 * reservation lifecycle releases it. A held allocation blocks only while
 * its hold is unexpired; legacy holds without an expiry are treated as active.
 */
const hasBlockingAllocation = async (
  unitId: Types.ObjectId | string,
  session: ClientSession,
  now = new Date(),
): Promise<boolean> => {
  const allocation = await UnitAllocation.exists({
    unitId,
    $or: [
      { status: 'confirmed' },
      {
        status: 'held',
        $or: [
          { holdExpiresAt: { $gt: now } },
          { holdExpiresAt: { $exists: false } },
        ],
      },
    ],
  }).session(session)

  return allocation !== null
}

const assertNotCheckedOut = (unit: IUnit): void => {
  if (unit.custodyStatus === 'checked_out') {
    throw ApiError.badRequest(
      'A checked-out Unit cannot have its condition or operational status changed',
    )
  }
}

const assertNoBlockingAllocation = async (
  unit: IUnit,
  session: ClientSession,
): Promise<void> => {
  if (await hasBlockingAllocation(unit._id, session)) {
    throw ApiError.conflict(
      'This Unit has an active reservation allocation and cannot change operational state',
    )
  }
}

const assertCanBeMadeAvailable = (unit: IUnit): void => {
  if (unit.condition === 'damaged') {
    throw ApiError.badRequest(
      'A damaged Unit must be repaired and inspected before it can become available',
    )
  }

  if (unit.custodyStatus !== 'in_stock') {
    throw ApiError.badRequest(
      'A Unit must be in stock before it can become available; use the ready operation after inspection',
    )
  }
}

const withInventoryTransaction = async <T>(
  operation: (session: ClientSession) => Promise<T>,
): Promise<T> => {
  const db = mongoose.connection.db

  if (!db) {
    throw ApiError.internal('MongoDB is not connected')
  }

  const hello = await db.admin().command({ hello: 1 }) as {
    setName?: string
    msg?: string
  }

  if (!hello.setName && hello.msg !== 'isdbgrid') {
    throw ApiError.internal(
      'Inventory state changes require MongoDB replica-set or sharded-cluster transaction support',
    )
  }

  const session = await mongoose.startSession()

  try {
    let result!: T

    await session.withTransaction(async () => {
      result = await operation(session)
      return result
    })

    return result
  } finally {
    await session.endSession()
  }
}

/**
 * Writes the same Product document that reservation creation writes. This
 * shared write serializes reservation allocation against Unit state changes.
 */
const contendOnProductInventory = async (
  productId: Types.ObjectId,
  session: ClientSession,
): Promise<void> => {
  const product = await Product.findById(productId)
    .select('+allocationVersion')
    .session(session)

  if (!product) {
    throw ApiError.conflict(
      'The Product for this Unit no longer exists; inventory state cannot change',
    )
  }

  product.allocationVersion = (product.allocationVersion ?? 0) + 1
  await product.save({ session })
}

export const unitService = {
  create: async (data: CreateUnitDTO): Promise<UnitResponseDTO> => {
    try {
      return await withInventoryTransaction(async (session) => {
        const product = await Product.findOne({
          _id: data.productId,
          status: 'active',
        })
          .select('+allocationVersion')
          .session(session)

        if (!product) {
          throw ApiError.notFound('Active product not found')
        }

        // This write serializes Unit creation with reservation creation and
        // catalog archiving, which both operate on the same Product record.
        product.allocationVersion = (product.allocationVersion ?? 0) + 1
        await product.save({ session })

        const condition = data.condition ?? 'good'
        const isDamaged = condition === 'damaged'
        const [unit] = await Unit.create(
          [
            {
              ...data,
              assetTag: data.assetTag.toUpperCase(),
              condition,
              operationalStatus: isDamaged ? 'maintenance' : 'available',
              custodyStatus: isDamaged ? 'inspection_required' : 'in_stock',
            },
          ],
          { session },
        )

        return mapResponse(unit)
      })
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        throwDuplicateKeyConflict(error)
      }

      throw error
    }
  },

  list: async (query: ListUnitsDTO) => {
    const page = query.page ?? 1
    const limit = query.limit ?? DEFAULT_UNIT_PAGE_SIZE
    const filter = query.productId
      ? { productId: query.productId }
      : {}

    const [units, total] = await Promise.all([
      Unit.find(filter)
        .sort({ createdAt: -1, _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Unit.countDocuments(filter),
    ])

    return {
      units: units.map(mapResponse),
      pagination: {
        total,
        totalPage: Math.ceil(total / limit),
        currentPage: page,
      },
    }
  },

  update: async (
    id: string,
    data: UpdateUnitDTO,
  ): Promise<UnitResponseDTO> => {
    try {
      return await withInventoryTransaction(async (session) => {
        const unit = await Unit.findById(id).session(session)

        if (!unit) {
          throw ApiError.notFound('Unit not found')
        }

        const conditionWillChange =
          data.condition !== undefined && data.condition !== unit.condition
        const operationalStatusWillChange =
          data.operationalStatus !== undefined &&
          data.operationalStatus !== unit.operationalStatus

        if (
          unit.operationalStatus === 'retired' &&
          (conditionWillChange ||
            (data.operationalStatus !== undefined &&
              data.operationalStatus !== 'retired'))
        ) {
          throw ApiError.badRequest(
            'A retired Unit cannot be reactivated or have its condition changed through the generic update endpoint',
          )
        }

        if (
          data.condition === 'damaged' &&
          data.operationalStatus === 'available'
        ) {
          throw ApiError.badRequest(
            'A damaged Unit cannot be marked available',
          )
        }

        const conditionChangesReadiness =
          conditionWillChange ||
          (data.condition === 'damaged' &&
            unit.operationalStatus !== 'maintenance')
        const operationalStateWillChange =
          operationalStatusWillChange || conditionChangesReadiness

        if (operationalStateWillChange) {
          assertNotCheckedOut(unit)
          // The Unit lifecycle transition and reservation allocation both
          // write the shared Product document inside transactions.
          await contendOnProductInventory(unit.productId, session)
          await assertNoBlockingAllocation(unit, session)
        }

        if (data.condition !== undefined) {
          unit.condition = data.condition

          if (data.condition === 'damaged') {
            unit.operationalStatus = 'maintenance'
            unit.custodyStatus = 'inspection_required'
          }
        }

        if (data.operationalStatus !== undefined) {
          if (data.operationalStatus === 'available') {
            assertCanBeMadeAvailable(unit)
          }

          if (data.operationalStatus === 'retired') {
            assertNotCheckedOut(unit)
            if (!operationalStateWillChange) {
              await contendOnProductInventory(unit.productId, session)
              await assertNoBlockingAllocation(unit, session)
            }
          }

          unit.operationalStatus = data.operationalStatus
        }

        if (data.serialNumber !== undefined) {
          unit.serialNumber = data.serialNumber ?? undefined
        }

        if (data.notes !== undefined) {
          unit.notes = data.notes ?? undefined
        }

        await unit.save({ session })
        return mapResponse(unit)
      })
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        throwDuplicateKeyConflict(error)
      }

      throw error
    }
  },

  /**
   * Called after repair/inspection. It is the only operation that changes
   * inspection-required custody back to normal stock custody.
   */
  markReady: async (id: string): Promise<UnitResponseDTO> =>
    withInventoryTransaction(async (session) => {
      const unit = await Unit.findById(id).session(session)

      if (!unit) {
        throw ApiError.notFound('Unit not found')
      }

      if (unit.operationalStatus === 'retired') {
        throw ApiError.badRequest('A retired Unit cannot be made ready')
      }

      assertNotCheckedOut(unit)

      if (unit.condition === 'damaged') {
        throw ApiError.badRequest(
          'Record the repaired condition before marking this Unit ready',
        )
      }

      const alreadyReady =
        unit.operationalStatus === 'available' &&
        unit.custodyStatus === 'in_stock'

      if (!alreadyReady) {
        await contendOnProductInventory(unit.productId, session)
        await assertNoBlockingAllocation(unit, session)
        unit.operationalStatus = 'available'
        unit.custodyStatus = 'in_stock'
        await unit.save({ session })
      }

      return mapResponse(unit)
    }),

  retire: async (id: string): Promise<void> =>
    withInventoryTransaction(async (session) => {
      const unit = await Unit.findById(id).session(session)

      if (!unit) {
        throw ApiError.notFound('Unit not found')
      }

      if (unit.operationalStatus === 'retired') {
        return
      }

      assertNotCheckedOut(unit)
      await contendOnProductInventory(unit.productId, session)
      await assertNoBlockingAllocation(unit, session)

      unit.operationalStatus = 'retired'
      await unit.save({ session })
    }),
}
