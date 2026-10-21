//src/modules/notification/notification.model.ts
import mongoose, { Schema, Types, Document } from 'mongoose'
import { NOTIFICATION_TYPES, NOTIFICATION_TTL_SECONDS, NotificationType } from './notification.constants.js'

export interface INotification extends Document {
  userId: Types.ObjectId
  type: NotificationType
  title: string
  message: string
  readAt?: Date | null
  createdAt: Date
  updatedAt: Date
}

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: NOTIFICATION_TYPES, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    readAt: { type: Date, default: null },
  },
  { timestamps: true }
)


notificationSchema.index({ userId: 1, createdAt: -1 })
notificationSchema.index({ userId: 1, readAt: 1 })

notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: NOTIFICATION_TTL_SECONDS })

export const Notification = mongoose.model<INotification>('Notification', notificationSchema)