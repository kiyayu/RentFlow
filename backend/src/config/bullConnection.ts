// src/config/bullConnection.ts
import { Redis } from 'ioredis'
import { env } from './env.js'
import { logger } from '../common/utils/logger.js'

export const bullConnection = new Redis(env.redisUri, {
  maxRetriesPerRequest: null,   // required by BullMQ — see last message for why
  tls: env.redisUri.startsWith('rediss://')
    ? { rejectUnauthorized: false }
    : undefined,
})

bullConnection.on('error', (err) => {
  logger.error({ err }, 'BullMQ Redis connection error')
})

bullConnection.on('connect', () => {
  logger.info('BullMQ Redis connection established')
})