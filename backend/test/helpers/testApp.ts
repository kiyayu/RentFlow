// test/helpers/testApp.ts
import express from 'express'
import cookieParser from 'cookie-parser'
import authRoutes from '../../src/modules/auth/auth.routes.js'
import { errorHandler } from '../../src/common/handlers/errorHandler.js'
import { connectRedis, disconnectRedis } from '../../src/config/redis.js'

export const buildTestApp = () => {
  const app = express()
  app.use(express.json())
  app.use(cookieParser())
  app.use('/api/auth', authRoutes)
  app.use(errorHandler)
  return app
}

export const connectTestRedis = connectRedis
export const disconnectTestRedis = disconnectRedis