
import mongoose from 'mongoose'

import { env } from './env.js'
import { logger } from '../common/utils/logger.js'

export const connectDB = async (): Promise<void> => {
  await mongoose.connect(env.mongoUri)

  logger.info('Database connected successfully')
}