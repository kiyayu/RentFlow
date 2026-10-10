 // src/app.ts
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import cookieParser from 'cookie-parser'

import { env } from './config/env.js'
import { errorHandler } from './common/handlers/errorHandler.js'
import { requestLogger } from './common/middlewares/requestLogger.js'
import authRoutes from './modules/auth/auth.routes.js'
import userRoutes from './modules/user/user.routes.js'
import notificationRoutes from './modules/notification/notification.routes.js'
import uploadRoutes from './modules/upload/upload.routes.js'

const app = express()

app.use(helmet())
app.use(cors({
  origin:      env.clientUrl,
  credentials: true,
  methods:     ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use(compression())
app.use(cookieParser(env.cookieSecret))
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))
app.use(requestLogger)

app.get('/health', (_req, res) => {
  res.status(200).json({
    success:   true,
    message:   'Server is running',
    timestamp: new Date().toISOString(),
    uptime:    process.uptime(),
    env:       env.nodeEnv,
  })
})
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/notifications', notificationRoutes) 
app.use('/api/uploads', uploadRoutes)
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

app.use(errorHandler)

export default app
