//src/workers/notification.worker.ts
import { Worker } from 'bullmq'
import { bullConnection } from '../config/bullConnection.js'
import { emailService } from '../common/utils/email.js'
import { logger } from '../common/utils/logger.js'
import type { NotificationEmailJob } from '../queues/notification.queue.js'

export const notificationWorker = new Worker<NotificationEmailJob>(
  'notification-email',
  async (job) => {
    const { to, name, subject, message } = job.data
    await emailService.sendNotificationEmail(to, name, subject, message)
  },
  { connection: bullConnection, concurrency: 5 }
)

notificationWorker.on('failed', (job, err) => {
  if (job) {
    logger.warn(`Notification job ${job.id} failed (attempt ${job.attemptsMade}/${job.opts.attempts}): ${err.message}`)
  }
})