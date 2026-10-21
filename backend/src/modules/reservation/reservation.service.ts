//src/modules/reservation/reservatin.service.ts
import mongoose, {
  Types,
  type ClientSession,
} from 'mongoose'
import { randomUUID } from 'node:crypto'

import { env } from '../../config/env.js'
import { ApiError } from '../../common/errors/apiErrors.js'
import { Product } from '../product/product.model.js'
import { Unit, type IUnit } from '../unit/unit.model.js'
import { User } from '../user/user.model.js'
import { notificationService } from '../notification/notification.service.js'

import {
  ACTIVE_ALLOCATION_STATUSES,
  DEFAULT_CUSTOMER_RESERVATION_PAGE_SIZE,
  DEFAULT_OPERATIONS_RESERVATION_PAGE_SIZE,
  EXPIRED_RESERVATION_SWEEP_BATCH_SIZE,
  LATE_FEE_DAILY_RATE,
  MILLISECONDS_PER_DAY,
  RESERVATION_HOLD_MS,
  SECURITY_DEPOSIT_RATE,
} from './reservation.constants.js'

import type {
  CreateReservationDTO,
  ListReservationsDTO,
  ReservationResponseDTO,
  UpdateReservationStatusDTO,
} from './reservation.dto.js'

import {
  Reservation,
  UnitAllocation,
  type IReservation,
} from './reservation.model.js'

type PopulatedCustomer = {
  _id: Types.ObjectId
  name: string
  email: string
}

type PopulatedUnit = Pick<IUnit, 'assetTag' | 'serialNumber' | 'condition'> & {
  _id: Types.ObjectId
}

const toMinorUnits = (amount: number): number =>
  Math.round((amount + Number.EPSILON) * 100)

const fromMinorUnits = (amount: number): number =>
  Number((amount / 100).toFixed(2))

const roundMoney = (amount: number): number =>
  fromMinorUnits(toMinorUnits(amount))

const getRentalDays = (startAt: Date, endAt: Date): number =>
  Math.ceil((endAt.getTime() - startAt.getTime()) / MILLISECONDS_PER_DAY)

const calculateLateFee = (
  reservation: IReservation,
  at = new Date(),
): number => {
  if (reservation.returnInspection) {
    return roundMoney(reservation.returnInspection.lateFee)
  }

  if (reservation.status !== 'checked_out' || at <= reservation.endAt) {
    return 0
  }

  const lateDays = Math.ceil(
    (at.getTime() - reservation.endAt.getTime()) / MILLISECONDS_PER_DAY,
  )

  const dailyRentalValueMinor = reservation.items.reduce(
    (total, item) => total + toMinorUnits(item.unitPrice) * item.quantity,
    0,
  )

  const dailyLateFeeMinor = Math.round(
    dailyRentalValueMinor * LATE_FEE_DAILY_RATE,
  )

  return fromMinorUnits(dailyLateFeeMinor * lateDays)
}

const toReservationResponse = (
  reservation: IReservation,
  assignedUnits: ReservationResponseDTO['assignedUnits'] = [],
): ReservationResponseDTO => {
  const subtotal = roundMoney(reservation.pricing.subtotal)
  const securityDeposit = roundMoney(reservation.pricing.securityDeposit)
  const totalDue = roundMoney(
    reservation.pricing.totalDue ?? subtotal + securityDeposit,
  )

  // paidTotal means collected money, not the amount the customer still owes.
  // Legacy pending reservations may have the previous incorrect value stored.
  const paidTotal = reservation.paidAt
    ? roundMoney(reservation.pricing.paidTotal ?? totalDue)
    : 0

  const customer = reservation.populated('customerId')
    ? reservation.customerId as unknown as PopulatedCustomer
    : undefined

  return {
    id: reservation._id.toString(),
    reservationNumber: reservation.reservationNumber,
    items: reservation.items.map((item) => ({
      productId: item.productId.toString(),
      productNameSnapshot: item.productNameSnapshot,
      quantity: item.quantity,
      unitPrice: roundMoney(item.unitPrice),
      lineTotal: roundMoney(item.lineTotal),
    })),
    startAt: reservation.startAt,
    endAt: reservation.endAt,
    status: reservation.status,
    holdExpiresAt: reservation.holdExpiresAt ?? undefined,
    pricing: {
      currency: reservation.pricing.currency,
      subtotal,
      securityDeposit,
      totalDue,
      paidTotal,
      lateFee: calculateLateFee(reservation),
    },
    paidAt: reservation.paidAt ?? undefined,
    createdAt: reservation.createdAt,
    customer: customer
      ? {
          id: customer._id.toString(),
          name: customer.name,
          email: customer.email,
        }
      : undefined,
    assignedUnits,
    returnInspection: reservation.returnInspection
      ? {
          condition: reservation.returnInspection.condition,
          notes: reservation.returnInspection.notes ?? undefined,
          inspectedAt: reservation.returnInspection.inspectedAt,
          lateFee: roundMoney(reservation.returnInspection.lateFee),
          depositReleased: reservation.returnInspection.depositReleased,
        }
      : undefined,
  }
}

const reservationNumber = (): string =>
  `RES-${new Date().getFullYear()}-${randomUUID()
    .replaceAll('-', '')
    .slice(0, 10)
    .toUpperCase()}`

const assertTransactionSupport = async (): Promise<void> => {
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
      'Reservation workflows require MongoDB replica-set or sharded-cluster transaction support',
    )
  }
}

const inTransaction = async <T>(
  operation: (session: ClientSession) => Promise<T>,
): Promise<T> => {
  await assertTransactionSupport()

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

const expireExpiredReservations = async (
  session: ClientSession,
  now = new Date(),
): Promise<number> => {
  const expiredCandidates = await Reservation.find({
    status: 'pending_payment',
    holdExpiresAt: { $lte: now },
  })
    .select('_id')
    .sort({ holdExpiresAt: 1 })
    .limit(EXPIRED_RESERVATION_SWEEP_BATCH_SIZE)
    .session(session)

  let expiredCount = 0

  for (const candidate of expiredCandidates) {
    const result = await Reservation.updateOne(
      {
        _id: candidate._id,
        status: 'pending_payment',
        holdExpiresAt: { $lte: now },
      },
      {
        $set: { status: 'expired' },
        $unset: { holdExpiresAt: '' },
      },
      { session },
    )

    if (result.modifiedCount !== 1) {
      continue
    }

    await UnitAllocation.updateMany(
      {
        reservationId: candidate._id,
        status: 'held',
      },
      {
        $set: { status: 'released' },
        $unset: { holdExpiresAt: '' },
      },
      { session },
    )

    expiredCount += 1
  }

  return expiredCount
}

const expireOneReservationIfNeeded = async (
  reservationId: string,
  customerId: string,
): Promise<void> => {
  await inTransaction(async (session) => {
    const now = new Date()

    const result = await Reservation.updateOne(
      {
        _id: reservationId,
        customerId,
        status: 'pending_payment',
        holdExpiresAt: { $lte: now },
      },
      {
        $set: { status: 'expired' },
        $unset: { holdExpiresAt: '' },
      },
      { session },
    )

    if (result.modifiedCount === 1) {
      await UnitAllocation.updateMany(
        { reservationId, status: 'held' },
        {
          $set: { status: 'released' },
          $unset: { holdExpiresAt: '' },
        },
        { session },
      )
    }
  })
}

const sweepExpiredReservations = async (): Promise<void> => {
  await inTransaction(async (session) => {
    await expireExpiredReservations(session)
  })
}

const attachAssignedUnits = async (
  reservations: IReservation[],
): Promise<ReservationResponseDTO[]> => {
  if (reservations.length === 0) {
    return []
  }

  const allocations = await UnitAllocation.find({
    reservationId: { $in: reservations.map((item) => item._id) },
  }).populate('unitId', 'assetTag serialNumber condition')

  const unitsByReservation = new Map<
    string,
    ReservationResponseDTO['assignedUnits']
  >()

  for (const allocation of allocations) {
    const unit = allocation.unitId as unknown as PopulatedUnit | null

    if (!unit?.assetTag) {
      continue
    }

    const reservationKey = allocation.reservationId.toString()
    const assignedUnits = unitsByReservation.get(reservationKey) ?? []

    assignedUnits.push({
      id: unit._id.toString(),
      assetTag: unit.assetTag,
      serialNumber: unit.serialNumber ?? undefined,
      condition: unit.condition,
    })

    unitsByReservation.set(reservationKey, assignedUnits)
  }

  return reservations.map((reservation) =>
    toReservationResponse(
      reservation,
      unitsByReservation.get(reservation._id.toString()) ?? [],
    ),
  )
}

const notifyStaffAboutReservation = async (
  reservation: IReservation,
  customerId: string,
): Promise<void> => {
  try {
    const customer = await User.findById(customerId).select('name email')
    if (!customer) return

    const staff = await User.find({
      role: { $in: ['staff', 'admin'] },
      isActive: true,
    }).select('name email')

    const results = await Promise.allSettled(
      staff.map((member) =>
        notificationService.notify({
          userId: member.id,
          emailTo: member.email,
          name: member.name,
          type: 'reservation_created',
          meta: {
            reservationNumber: reservation.reservationNumber,
            customerName: customer.name,
          },
        }),
      ),
    )

    if (results.some((result) => result.status === 'rejected')) {
      console.error('One or more reservation-created notifications failed', {
        reservationNumber: reservation.reservationNumber,
      })
    }
  } catch {
    
    console.error('Reservation-created notification processing failed', {
      reservationNumber: reservation.reservationNumber,
    })
  }
}

const notifyCustomerReservationConfirmed = async (
  reservation: IReservation,
  customerId: string,
): Promise<void> => {
  try {
    const customer = await User.findById(customerId).select('name email')
    if (!customer) return

    await notificationService.notify({
      userId: customer.id,
      emailTo: customer.email,
      name: customer.name,
      type: 'reservation_confirmed',
      meta: { reservationNumber: reservation.reservationNumber },
    })
  } catch {
    console.error('Reservation-confirmed notification processing failed', {
      reservationNumber: reservation.reservationNumber,
    })
  }
}

const createReservationInTransaction = async (
  customerId: string,
  input: CreateReservationDTO,
  session: ClientSession,
): Promise<IReservation> => {
  const now = new Date()

 
  if (input.startAt <= now) {
    throw ApiError.badRequest('Reservation start time must be in the future')
  }

  if (input.endAt <= input.startAt) {
    throw ApiError.badRequest('Reservation end time must be after start time')
  }

  const products = await Product.find({
    _id: { $in: input.items.map((item) => item.productId) },
    status: 'active',
  })
    .select('+allocationVersion')
    .session(session)

  if (products.length !== input.items.length) {
    throw ApiError.notFound('One or more products are unavailable')
  }

  const productsById = new Map(
    products.map((product) => [product._id.toString(), product]),
  )

  const days = getRentalDays(input.startAt, input.endAt)
  const holdExpiresAt = new Date(now.getTime() + RESERVATION_HOLD_MS)

  const items = input.items.map((requestedItem) => {
    const product = productsById.get(requestedItem.productId)

 
    if (!product) {
      throw ApiError.notFound('One or more products are unavailable')
    }

    const unitPrice = roundMoney(product.rentalPricing.amount)
    const lineTotal = fromMinorUnits(
      toMinorUnits(unitPrice) * requestedItem.quantity * days,
    )

    return {
      productId: product._id,
      productNameSnapshot: product.name,
      quantity: requestedItem.quantity,
      unitPrice,
      lineTotal,
    }
  })

  const allocations: {
    unitId: Types.ObjectId
    startAt: Date
    endAt: Date
    status: 'held'
    holdExpiresAt: Date
  }[] = []

  for (const item of items) {
    const units = await Unit.find({
      productId: item.productId,
      operationalStatus: 'available',
      custodyStatus: 'in_stock',
    })
      .sort({ _id: 1 })
      .session(session)

    if (units.length === 0) {
      throw ApiError.conflict(
        `Insufficient inventory for ${item.productNameSnapshot}`,
      )
    }

    const conflicts = await UnitAllocation.find({
      unitId: { $in: units.map((unit) => unit._id) },
      startAt: { $lt: input.endAt },
      endAt: { $gt: input.startAt },
      $or: [
        { status: 'confirmed' },
        { status: 'held', holdExpiresAt: { $gt: now } },
        // A held allocation without an expiry is treated as active, not silently freed.
        { status: 'held', holdExpiresAt: { $exists: false } },
      ],
    })
      .select('unitId')
      .session(session)

    const unavailableUnitIds = new Set(
      conflicts.map((allocation) => allocation.unitId.toString()),
    )

    const selectedUnits = units
      .filter((unit) => !unavailableUnitIds.has(unit._id.toString()))
      .slice(0, item.quantity)

    if (selectedUnits.length !== item.quantity) {
      throw ApiError.conflict(
        `Insufficient inventory for ${item.productNameSnapshot}`,
      )
    }

    allocations.push(
      ...selectedUnits.map((unit) => ({
        unitId: unit._id,
        startAt: input.startAt,
        endAt: input.endAt,
        status: 'held' as const,
        holdExpiresAt,
      })),
    )
  }

 
  for (const product of products) {
    product.allocationVersion = (product.allocationVersion ?? 0) + 1
    await product.save({ session })
  }

  const subtotalMinor = items.reduce(
    (total, item) => total + toMinorUnits(item.lineTotal),
    0,
  )
  const subtotal = fromMinorUnits(subtotalMinor)
  const securityDeposit = fromMinorUnits(
    Math.round(subtotalMinor * SECURITY_DEPOSIT_RATE),
  )
  const totalDue = fromMinorUnits(
    subtotalMinor + toMinorUnits(securityDeposit),
  )

  const [reservation] = await Reservation.create(
    [
      {
        reservationNumber: reservationNumber(),
        customerId,
        items,
        startAt: input.startAt,
        endAt: input.endAt,
        status: 'pending_payment',
        holdExpiresAt,
        pricing: {
          currency: 'ETB',
          subtotal,
          securityDeposit,
          totalDue,
          paidTotal: 0,
        },
      },
    ],
    { session },
  )

  await UnitAllocation.insertMany(
    allocations.map((allocation) => ({
      ...allocation,
      reservationId: reservation._id,
    })),
    { session, ordered: true },
  )

  return reservation
}

const isDuplicateKeyError = (error: unknown): boolean =>
  typeof error === 'object' &&
  error !== null &&
  'code' in error &&
  error.code === 11000

export const reservationService = {
  create: async (
    customerId: string,
    input: CreateReservationDTO,
  ): Promise<ReservationResponseDTO> => {
    await sweepExpiredReservations()

    let reservation: IReservation

    try {
      reservation = await inTransaction((session) =>
        createReservationInTransaction(customerId, input, session),
      )
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        throw ApiError.conflict(
          'A reservation identifier conflicted. Please retry the request',
        )
      }

      throw error
    }

    await notifyStaffAboutReservation(reservation, customerId)

    const [mappedReservation] = await attachAssignedUnits([reservation])
    return mappedReservation
  },

  listMine: async (customerId: string, query: ListReservationsDTO) => {
    await sweepExpiredReservations()

    const page = query.page ?? 1
    const limit = query.limit ?? DEFAULT_CUSTOMER_RESERVATION_PAGE_SIZE
    const filter = { customerId }

    const [reservations, total] = await Promise.all([
      Reservation.find(filter)
        .sort({ createdAt: -1, _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Reservation.countDocuments(filter),
    ])

    return {
      reservations: await attachAssignedUnits(reservations),
      pagination: {
        total,
        totalPage: Math.ceil(total / limit),
        currentPage: page,
      },
    }
  },

  listOperations: async (query: ListReservationsDTO) => {
    await sweepExpiredReservations()

    const page = query.page ?? 1
    const limit = query.limit ?? DEFAULT_OPERATIONS_RESERVATION_PAGE_SIZE

    const [reservations, total] = await Promise.all([
      Reservation.find({})
        .populate('customerId', 'name email')
        .sort({ createdAt: -1, _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Reservation.countDocuments({}),
    ])

    return {
      reservations: await attachAssignedUnits(reservations),
      pagination: {
        total,
        totalPage: Math.ceil(total / limit),
        currentPage: page,
      },
    }
  },

  simulatePayment: async (
    customerId: string,
    id: string,
  ): Promise<ReservationResponseDTO> => {
    if (env.nodeEnv === 'production') {
      throw ApiError.badRequest(
        'Simulated payments are disabled in production',
      )
    }

    await expireOneReservationIfNeeded(id, customerId)
    await sweepExpiredReservations()

    const paymentResult = await inTransaction(async (session) => {
      const currentReservation = await Reservation.findOne({
        _id: id,
        customerId,
      }).session(session)

      if (!currentReservation) {
        throw ApiError.notFound('Reservation not found')
      }

      // Safe retry for a request whose simulated payment already committed.
      if (
        currentReservation.status === 'confirmed' &&
        currentReservation.paidAt
      ) {
        return {
          reservation: currentReservation,
          expired: false,
          newlyConfirmed: false,
        }
      }

      if (currentReservation.status !== 'pending_payment') {
        throw ApiError.badRequest('Reservation cannot be paid in its current state')
      }

      const now = new Date()
      if (
        !currentReservation.holdExpiresAt ||
        currentReservation.holdExpiresAt <= now
      ) {
        // Commit expiry/release first, then report the rejected payment outside
        // the transaction so the expiry update is not rolled back by an error.
        currentReservation.status = 'expired'
        currentReservation.holdExpiresAt = undefined
        await currentReservation.save({ session })

        await UnitAllocation.updateMany(
          { reservationId: currentReservation._id, status: 'held' },
          {
            $set: { status: 'released' },
            $unset: { holdExpiresAt: '' },
          },
          { session },
        )

        return {
          reservation: currentReservation,
          expired: true,
          newlyConfirmed: false,
        }
      }

      const expectedUnitCount = currentReservation.items.reduce(
        (total, item) => total + item.quantity,
        0,
      )

      const heldAllocations = await UnitAllocation.find({
        reservationId: currentReservation._id,
        status: 'held',
      }).session(session)

      if (heldAllocations.length !== expectedUnitCount) {
        throw ApiError.conflict(
          'The reservation inventory hold is incomplete. It cannot be confirmed',
        )
      }

      currentReservation.status = 'confirmed'
      currentReservation.paidAt = now
      currentReservation.pricing.paidTotal = roundMoney(
        currentReservation.pricing.totalDue ??
          currentReservation.pricing.subtotal +
            currentReservation.pricing.securityDeposit,
      )
      currentReservation.holdExpiresAt = undefined

      await currentReservation.save({ session })

      const allocationUpdate = await UnitAllocation.updateMany(
        {
          reservationId: currentReservation._id,
          status: 'held',
        },
        {
          $set: { status: 'confirmed' },
          $unset: { holdExpiresAt: '' },
        },
        { session },
      )

      if (allocationUpdate.modifiedCount !== expectedUnitCount) {
        throw ApiError.conflict(
          'The reservation inventory hold changed while payment was being confirmed',
        )
      }

      return {
        reservation: currentReservation,
        expired: false,
        newlyConfirmed: true,
      }
    })

    if (paymentResult.expired) {
      throw ApiError.badRequest(
        'The reservation hold has expired. Create a new reservation',
      )
    }

    if (paymentResult.newlyConfirmed) {
      await notifyCustomerReservationConfirmed(
        paymentResult.reservation,
        customerId,
      )
    }

    const [mappedReservation] = await attachAssignedUnits([
      paymentResult.reservation,
    ])
    return mappedReservation
  },

  updateStatus: async (
    id: string,
    data: UpdateReservationStatusDTO,
  ): Promise<ReservationResponseDTO> => {
    await sweepExpiredReservations()

    const updatedReservation = await inTransaction(async (session) => {
      const reservation = await Reservation.findById(id).session(session)

      if (!reservation) {
        throw ApiError.notFound('Reservation not found')
      }

      const now = new Date()
      const expectedUnitCount = reservation.items.reduce(
        (total, item) => total + item.quantity,
        0,
      )

      if (data.status === 'checked_out') {
        if (reservation.status !== 'confirmed') {
          throw ApiError.badRequest(
            'Only confirmed reservations can be checked out',
          )
        }

        const allocations = await UnitAllocation.find({
          reservationId: reservation._id,
          status: 'confirmed',
        }).session(session)

        if (allocations.length !== expectedUnitCount) {
          throw ApiError.conflict(
            'The reservation does not have the expected number of allocated Units',
          )
        }

        const unitIds = allocations.map((allocation) => allocation.unitId)
        const units = await Unit.find({
          _id: { $in: unitIds },
          operationalStatus: 'available',
          custodyStatus: 'in_stock',
        }).session(session)

        if (units.length !== expectedUnitCount) {
          throw ApiError.conflict(
            'One or more allocated Units are not ready for handover',
          )
        }

        for (const unit of units) {
          unit.custodyStatus = 'checked_out'
          await unit.save({ session })
        }

        reservation.status = 'checked_out'
        reservation.holdExpiresAt = undefined
        await reservation.save({ session })
      } else if (data.status === 'cancelled') {
        if (
          reservation.status !== 'pending_payment' &&
          reservation.status !== 'confirmed'
        ) {
          throw ApiError.badRequest(
            'Only reservations that have not been checked out can be cancelled',
          )
        }

        if (reservation.paidAt) {
          throw ApiError.badRequest(
            'This reservation has a recorded payment. Use the refund workflow before cancelling it',
          )
        }

        await UnitAllocation.updateMany(
          {
            reservationId: reservation._id,
            status: { $in: ACTIVE_ALLOCATION_STATUSES },
          },
          {
            $set: { status: 'released' },
            $unset: { holdExpiresAt: '' },
          },
          { session },
        )

        reservation.status = 'cancelled'
        reservation.holdExpiresAt = undefined
        await reservation.save({ session })
      } else {
        if (reservation.status !== 'checked_out') {
          throw ApiError.badRequest(
            'Only checked-out reservations can be completed',
          )
        }

        if (!data.returnCondition) {
          throw ApiError.badRequest('Return condition is required')
        }

        const lateFee = calculateLateFee(reservation, now)
        const allocations = await UnitAllocation.find({
          reservationId: reservation._id,
          status: 'confirmed',
        }).session(session)

        if (allocations.length !== expectedUnitCount) {
          throw ApiError.conflict(
            'The reservation does not have the expected number of allocated Units',
          )
        }

        const unitIds = allocations.map((allocation) => allocation.unitId)
        const units = await Unit.find({
          _id: { $in: unitIds },
          custodyStatus: 'checked_out',
        }).session(session)

        if (units.length !== expectedUnitCount) {
          throw ApiError.conflict(
            'One or more Units are not recorded as checked out for this reservation',
          )
        }

      
for (const unit of units) {
  unit.condition = data.returnCondition
  unit.custodyStatus = 'inspection_required'

  if (data.returnCondition === 'damaged') {
    unit.operationalStatus = 'maintenance'
  }

  await unit.save({ session })
}

        await UnitAllocation.updateMany(
          {
            reservationId: reservation._id,
            status: 'confirmed',
          },
          { $set: { status: 'released' } },
          { session },
        )

        reservation.status = 'completed'
        reservation.holdExpiresAt = undefined
        reservation.returnInspection = {
          condition: data.returnCondition,
          notes: data.returnNotes || undefined,
          inspectedAt: now,
          lateFee,
          // No real payment/refund provider is connected yet. Do not claim
          // that money has been returned merely because the equipment is good.
          depositReleased: false,
        }

        await reservation.save({ session })
      }

      return reservation
    })

    const [mappedReservation] = await attachAssignedUnits([updatedReservation])
    return mappedReservation
  },
}
