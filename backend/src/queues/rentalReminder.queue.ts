import { Queue } from 'bullmq'
import { bullConnection } from '../config/bullConnection.js'

export const rentalReminderQueue = new Queue('rental-reminders', { connection: bullConnection })
