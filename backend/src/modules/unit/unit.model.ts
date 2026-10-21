//src/modules/unit/unit.model.ts
import mongoose, {
  Schema,
  type Document,
  type Types,
} from 'mongoose'

import {
  UNIT_CONDITIONS,
  UNIT_CUSTODY_STATUSES,
  UNIT_OPERATIONAL_STATUSES,
} from './unit.constants.js'

export interface IUnit extends Document {
  productId: Types.ObjectId
  assetTag: string
  serialNumber?: string
  condition: (typeof UNIT_CONDITIONS)[number]
  operationalStatus: (typeof UNIT_OPERATIONAL_STATUSES)[number]
  custodyStatus: (typeof UNIT_CUSTODY_STATUSES)[number]
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const unitSchema = new Schema<IUnit>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
      immutable: true,
    },

    assetTag: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      unique: true,
      maxlength: 80,
    },

    serialNumber: {
      type: String,
      trim: true,
      sparse: true,
      unique: true,
      maxlength: 120,
    },

    condition: {
      type: String,
      enum: UNIT_CONDITIONS,
      default: 'good',
      required: true,
    },

    operationalStatus: {
      type: String,
      enum: UNIT_OPERATIONAL_STATUSES,
      default: 'available',
      required: true,
      index: true,
    },

    custodyStatus: {
      type: String,
      enum: UNIT_CUSTODY_STATUSES,
      default: 'in_stock',
      required: true,
      index: true,
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
  },
  {
    timestamps: true,
  },
)

unitSchema.index({ productId: 1, operationalStatus: 1, custodyStatus: 1 })

export const Unit = mongoose.model<IUnit>('Unit', unitSchema)
