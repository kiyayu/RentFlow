
import { Redis } from 'ioredis'

import { env } from './env.js'
import { logger } from '../common/utils/logger.js'

export const bullConnection = new Redis(env.redisUri, {
  maxRetriesPerRequest: null,
})

bullConnection.on('error', (error) => {
  logger.error(
    {
      name: error.name,
      code: 'code' in error ? error.code : undefined,
    },
    'BullMQ Redis connection error',
  )
})

bullConnection.on('connect', () => {
  logger.info('BullMQ Redis connection established')
})