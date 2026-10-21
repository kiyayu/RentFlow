import { Worker } from 'bullmq'
import { bullConnection } from '../config/bullConnection.js'
import { Reservation } from '../modules/reservation/reservation.model.js'
import { User } from '../modules/user/user.model.js'
import { notificationService } from '../modules/notification/notification.service.js'

const oneDay = 24 * 60 * 60 * 1000

export const rentalReminderWorker = new Worker(
  'rental-reminders',
  async () => {
    const now = new Date()
    const dueSoon = await Reservation.find({ status: 'checked_out', endAt: { $gt: now, $lte: new Date(now.getTime() + oneDay) }, dueReminderSentAt: { $exists: false } })
    for (const reservation of dueSoon) {
      const claimed = await Reservation.findOneAndUpdate({ _id: reservation._id, dueReminderSentAt: { $exists: false } }, { $set: { dueReminderSentAt: now } })
      if (!claimed) continue
      const customer = await User.findById(reservation.customerId).select('name email')
      if (customer) await notificationService.notify({ userId: customer.id, emailTo: customer.email, name: customer.name, type: 'rental_due_soon', meta: { reservationNumber: reservation.reservationNumber, dueAt: reservation.endAt.toLocaleString() } })
    }
    const overdue = await Reservation.find({ status: 'checked_out', endAt: { $lte: now }, overdueNotifiedAt: { $exists: false } })
    for (const reservation of overdue) {
      const claimed = await Reservation.findOneAndUpdate({ _id: reservation._id, overdueNotifiedAt: { $exists: false } }, { $set: { overdueNotifiedAt: now } })
      if (!claimed) continue
      const customer = await User.findById(reservation.customerId).select('name email')
      if (customer) await notificationService.notify({ userId: customer.id, emailTo: customer.email, name: customer.name, type: 'rental_overdue', meta: { reservationNumber: reservation.reservationNumber, dueAt: reservation.endAt.toLocaleString() } })
    }
  },
  { connection: bullConnection, concurrency: 1 }
)
