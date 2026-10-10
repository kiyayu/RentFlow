//src/queues/notification.queue.ts
import { Queue } from 'bullmq'
import { bullConnection } from '../config/bullConnection.js'

export type NotificationEmailJob = { to: string; name: string; subject: string; message: string }

// Separate from the 'email' queue: that worker treats every job as an OTP.
export const notificationQueue = new Queue<NotificationEmailJob>('notification-email', {
  connection: bullConnection,
  defaultJobOptions: {
    attempts: 5,
    backoff: { type: 'exponential', delay: 1000 },
    removeOnComplete: { age: 3600, count: 1000 },
    removeOnFail: { age: 86400 },
  },
})