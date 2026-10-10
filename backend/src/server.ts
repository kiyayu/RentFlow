import type { Server } from 'node:http'
import mongoose from 'mongoose'
import app from './app.js'
import { env } from './config/env.js'
import { connectDB } from './config/db.js'
import { bullConnection } from './config/bullConnection.js'
import { connectRedis, disconnectRedis } from './config/redis.js'
import { emailQueue } from './queues/email.queue.js'
import { resetQueue } from './queues/reset.queue.js'
import { emailWorker } from './workers/email.worker.js'
import { resetWorker } from './workers/reset.worker.js'
import { notificationQueue } from './queues/notification.queue.js'
import { notificationWorker } from './workers/notification.worker.js'
import { logger } from './common/utils/logger.js'
import { verifySmtpConnection } from './common/utils/email.js'

let server: Server | undefined
let shuttingDown = false

async function closeDependencies() {
  const results = await Promise.allSettled([
    emailWorker.close(),
    resetWorker.close(),
    notificationWorker.close(),
    emailQueue.close(),
    resetQueue.close(),
    notificationQueue.close(),
    disconnectRedis(),
    mongoose.disconnect(),
    bullConnection.quit(),
  ])

  for (const result of results) {
    if (result.status === 'rejected') {
      logger.error({ err: result.reason }, 'Error while shutting down a dependency')
    }
  }
}

function shutdown(signal: NodeJS.Signals) {
  if (shuttingDown) return
  shuttingDown = true

  logger.info({ signal }, 'Shutdown signal received')

  const forceExitTimer = setTimeout(() => {
    logger.error('Graceful shutdown timed out')
    process.exit(1)
  }, 10_000)
  forceExitTimer.unref()

  const finish = async (error?: Error) => {
    await closeDependencies()
    clearTimeout(forceExitTimer)
    process.exitCode = error ? 1 : 0
  }

  if (!server) {
    void finish()
    return
  }

  server.close((error) => {
    void finish(error)
  })
}

async function startServer() {
  await connectDB()
  await connectRedis()
  //await verifySmtpConnection()
  await new Promise<void>((resolve, reject) => {
    const httpServer = app.listen(env.port)

    httpServer.once('error', reject)
    httpServer.once('listening', () => {
      server = httpServer
      logger.info({ port: env.port, env: env.nodeEnv }, 'HTTP server listening')
      resolve()
    })
  })

  process.once('SIGINT', shutdown)
  process.once('SIGTERM', shutdown)
}

startServer().catch(async (error: unknown) => {
  logger.fatal({ err: error }, 'Server startup failed')
  await closeDependencies()
  process.exit(1)
})
