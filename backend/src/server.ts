//src/server.ts
import type { Server } from 'node:http'
import mongoose from 'mongoose'

import app from './app.js'
import { env } from './config/env.js'
import { connectDB } from './config/db.js'
import { bullConnection } from './config/bullConnection.js'
import { connectRedis, disconnectRedis } from './config/redis.js'

import { emailQueue } from './queues/email.queue.js'
import { resetQueue } from './queues/reset.queue.js'
import { notificationQueue } from './queues/notification.queue.js'
import { rentalReminderQueue } from './queues/rentalReminder.queue.js'

import { emailWorker } from './workers/email.worker.js'
import { resetWorker } from './workers/reset.worker.js'
import { notificationWorker } from './workers/notification.worker.js'
import { rentalReminderWorker } from './workers/rentalReminder.worker.js'

import { logger } from './common/utils/logger.js'

let server: Server | undefined
let shuttingDown = false

async function closeDependencies(): Promise<boolean> {
  let failed = false

  const closeGroup = async (
    name: string,
    operations: Array<() => Promise<unknown>>,
  ): Promise<void> => {
    const results = await Promise.allSettled(
      operations.map((operation) => operation()),
    )

    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        failed = true

        logger.error(
          { err: result.reason, dependency: name },
          'Dependency shutdown failed',
        )
      }
    })
  }

  // Stop workers first so they can finish or release active jobs.
  await closeGroup('workers', [
    () => emailWorker.close(),
    () => resetWorker.close(),
    () => notificationWorker.close(),
    () => rentalReminderWorker.close(),
  ])

  // Close queues after workers have stopped.
  await closeGroup('queues', [
    () => emailQueue.close(),
    () => resetQueue.close(),
    () => notificationQueue.close(),
    () => rentalReminderQueue.close(),
  ])

  // Close infrastructure connections last.
  await closeGroup('connections', [
    () => disconnectRedis(),
    () => mongoose.disconnect(),
    async () => {
      if (bullConnection.status === 'ready') {
        await bullConnection.quit()
      } else {
        bullConnection.disconnect()
      }
    },
  ])

  return !failed
}

async function stopHttpServer(): Promise<void> {
  if (!server) return

  const httpServer = server
  server = undefined

  await new Promise<void>((resolve, reject) => {
    httpServer.close((error) => {
      if (error) {
        reject(error)
        return
      }

      resolve()
    })

    // Close idle keep-alive connections where supported by Node.
    httpServer.closeIdleConnections()
  })
}

async function shutdown(signal: NodeJS.Signals): Promise<void> {
  if (shuttingDown) return

  shuttingDown = true
  logger.info({ signal }, 'Shutdown signal received')

  const forceExitTimer = setTimeout(() => {
    logger.error('Graceful shutdown timed out')
    process.exit(1)
  }, 10_000)

  try {
    await stopHttpServer()

    const cleanupSucceeded = await closeDependencies()

    if (!cleanupSucceeded) {
      process.exitCode = 1
    }

    logger.info('Shutdown cleanup finished')
  } catch (error) {
    process.exitCode = 1
    logger.error({ err: error }, 'Shutdown failed')
  } finally {
    clearTimeout(forceExitTimer)
  }
}

async function startServer(): Promise<void> {
  await connectDB()
  await connectRedis()

  await rentalReminderQueue.upsertJobScheduler(
    'rental-reminder-scan',
    { every: 60 * 60 * 1000 },
    { name: 'scan', data: {} },
  )

  await new Promise<void>((resolve, reject) => {
    const httpServer = app.listen(env.port)

    httpServer.once('error', reject)

    httpServer.once('listening', () => {
      server = httpServer

      logger.info(
        { port: env.port, env: env.nodeEnv },
        'HTTP server listening',
      )

      resolve()
    })
  })

  process.once('SIGINT', () => {
    void shutdown('SIGINT')
  })

  process.once('SIGTERM', () => {
    void shutdown('SIGTERM')
  })
}

startServer().catch(async (error: unknown) => {
  logger.fatal({ err: error }, 'Server startup failed')

  shuttingDown = true

  const forceExitTimer = setTimeout(() => {
    logger.error('Startup cleanup timed out')
    process.exit(1)
  }, 10_000)

  try {
    await stopHttpServer()

    const cleanupSucceeded = await closeDependencies()
    process.exitCode = cleanupSucceeded ? 1 : 1
  } catch (cleanupError) {
    logger.error({ err: cleanupError }, 'Startup cleanup failed')
    process.exitCode = 1
  } finally {
    clearTimeout(forceExitTimer)
  }
})