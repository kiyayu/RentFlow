//src/modules/reservation/reservation.module.ts
import mongoose, {
  Schema,
  type Document,
  type Types,
} from 'mongoose'

import {
  ALLOCATION_STATUSES,
  RESERVATION_STATUSES,
} from './reservation.constants.js'

interface IReservationItem {
  productId: Types.ObjectId
  productNameSnapshot: string
  quantity: number
  unitPrice: number
  lineTotal: number
}

interface IReservationPricing {
  currency: 'ETB'
  subtotal: number
  securityDeposit: number
  // Optional in the schema temporarily so existing documents can be read
  // before the small data migration described in the setup notes is run.
  totalDue?: number
  paidTotal: number
}

interface IReturnInspection {
  condition: 'good' | 'damaged'
  notes?: string
  inspectedAt: Date
  lateFee: number
  depositReleased: boolean
}

export interface IReservation extends Document {
  reservationNumber: string
  customerId: Types.ObjectId
  items: IReservationItem[]
  startAt: Date
  endAt: Date
  status: (typeof RESERVATION_STATUSES)[number]
  holdExpiresAt?: Date
  pricing: IReservationPricing
  returnInspection?: IReturnInspection
  paidAt?: Date
  dueReminderSentAt?: Date
  overdueNotifiedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface IUnitAllocation extends Document {
  unitId: Types.ObjectId
  reservationId: Types.ObjectId
  startAt: Date
  endAt: Date
  status: (typeof ALLOCATION_STATUSES)[number]
  holdExpiresAt?: Date
  createdAt: Date
  updatedAt: Date
}

const itemSchema = new Schema<IReservationItem>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    productNameSnapshot: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      max: 20,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0.01,
    },
    lineTotal: {
      type: Number,
      required: true,
      min: 0.01,
    },
  },
  { _id: false },
)

const returnInspectionSchema = new Schema<IReturnInspection>(
  {
    condition: {
      type: String,
      enum: ['good', 'damaged'],
      required: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    inspectedAt: {
      type: Date,
      required: true,
    },
    lateFee: {
      type: Number,
      required: true,
      min: 0,
    },
    // This stays false until a real deposit-refund workflow confirms release.
    depositReleased: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { _id: false },
)

const reservationSchema = new Schema<IReservation>(
  {
    reservationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    items: {
      type: [itemSchema],
      required: true,
      validate: {
        validator: (items: IReservationItem[]) =>
          items.length > 0 && items.length <= 20,
        message: 'A reservation must contain between 1 and 20 products',
      },
    },
    startAt: {
      type: Date,
      required: true,
    },
    endAt: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: RESERVATION_STATUSES,
      required: true,
      index: true,
    },
    holdExpiresAt: {
      type: Date,
      index: true,
    },
    pricing: {
      currency: {
        type: String,
        enum: ['ETB'],
        required: true,
      },
      subtotal: {
        type: Number,
        required: true,
        min: 0,
      },
      securityDeposit: {
        type: Number,
        required: true,
        min: 0,
      },
      totalDue: {
        type: Number,
        min: 0,
      },
      paidTotal: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
      },
    },
    returnInspection: {
      type: returnInspectionSchema,
      default: undefined,
    },
    paidAt: Date,
    dueReminderSentAt: Date,
    overdueNotifiedAt: Date,
  },
  { timestamps: true },
)

reservationSchema.pre('validate', function () {
  if (this.startAt && this.endAt && this.endAt <= this.startAt) {
    this.invalidate('endAt', 'End time must be after start time')
  }
})

const allocationSchema = new Schema<IUnitAllocation>(
  {
    unitId: {
      type: Schema.Types.ObjectId,
      ref: 'Unit',
      required: true,
    },
    reservationId: {
      type: Schema.Types.ObjectId,
      ref: 'Reservation',
      required: true,
    },
    startAt: {
      type: Date,
      required: true,
    },
    endAt: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ALLOCATION_STATUSES,
      required: true,
      index: true,
    },
    holdExpiresAt: {
      type: Date,
      index: true,
    },
  },
  { timestamps: true },
)

allocationSchema.index({
  unitId: 1,
  status: 1,
  startAt: 1,
  endAt: 1,
})
allocationSchema.index({ reservationId: 1, status: 1 })

reservationSchema.index({ customerId: 1, createdAt: -1 })
reservationSchema.index({ status: 1, holdExpiresAt: 1 })

export const Reservation = mongoose.model<IReservation>(
  'Reservation',
  reservationSchema,
)

export const UnitAllocation = mongoose.model<IUnitAllocation>(
  'UnitAllocation',
  allocationSchema,
)
