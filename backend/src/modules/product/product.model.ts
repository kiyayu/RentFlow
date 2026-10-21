//src/modules/product/product.model.ts
import mongoose, { Document, Schema, Types } from 'mongoose'
import { BILLING_UNITS, PRODUCT_STATUSES } from './product.constants.js'

export interface IProduct extends Document {
  name: string
  slug: string
  description: string
  brand?: string
  images: string[]
  specifications: Map<string, string>
  rentalPricing: {
    amount: number
    currency: 'ETB'
    billingUnit: 'day'
  }
  status: 'active' | 'archived'
  allocationVersion: number
  createdBy: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true, index: true },
    description: { type: String, required: true, trim: true, maxlength: 5000 },
    brand: { type: String, trim: true, maxlength: 120 },
    images: { type: [String], default: [] },
    specifications: { type: Map, of: String, default: {} },
    rentalPricing: {
      amount: { type: Number, required: true, min: 0.01 },
      currency: { type: String, enum: ['ETB'], required: true },
      billingUnit: { type: String, enum: BILLING_UNITS, required: true },
    },
    status: { type: String, enum: PRODUCT_STATUSES, default: 'active', index: true },
    allocationVersion: { type: Number, default: 0, select: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
)

productSchema.index({ status: 1, createdAt: -1 })

export const Product = mongoose.model<IProduct>('Product', productSchema)
