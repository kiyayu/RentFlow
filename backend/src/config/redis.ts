//src/config/redis.ts
import { createClient } from 'redis'

import { logger } from '../common/utils/logger.js'
import { env } from './env.js'

const client = createClient({
  url: env.redisUri,
  ...(env.redisUri.startsWith('rediss://')
    ? { socket: { tls: true as const } }
    : {}),
})

client.on('error', (error) => {
  const redisError = error as NodeJS.ErrnoException

  logger.error(
    {
      name: error.name,
      code: redisError.code,
    },
    'Redis client error',
  )
})

client.on('connect', () => {
  logger.info('Redis connected')
})

client.on('reconnecting', () => {
  logger.warn('Redis reconnecting')
})

const incrementWithExpiryScript = `
  local count = redis.call('INCR', KEYS[1])
  local ttl = redis.call('TTL', KEYS[1])

  if ttl < 0 then
    redis.call('EXPIRE', KEYS[1], ARGV[1])
  end

  return count
`

export const connectRedis = async (): Promise<void> => {
  if (!client.isOpen) {
    await client.connect()
  }
}

export const disconnectRedis = async (): Promise<void> => {
  if (client.isOpen) {
    await client.disconnect()
  }
}

export const redis = {
  set: async (
    key: string,
    value: string,
    ttlSeconds: number,
  ): Promise<void> => {
    if (!Number.isInteger(ttlSeconds) || ttlSeconds < 1) {
      throw new RangeError('TTL must be a positive integer')
    }

    await client.setEx(key, ttlSeconds, value)
  },

  get: async (key: string): Promise<string | null> => {
    return client.get(key)
  },

  delete: async (key: string): Promise<void> => {
    await client.del(key)
  },

  increment: async (
    key: string,
    ttlSeconds: number,
  ): Promise<number> => {
    if (!Number.isInteger(ttlSeconds) || ttlSeconds < 1) {
      throw new RangeError('TTL must be a positive integer')
    }

    const result = await client.eval(incrementWithExpiryScript, {
      keys: [key],
      arguments: [String(ttlSeconds)],
    })

    return Number(result)
  },

  ttl: async (key: string): Promise<number> => {
    return client.ttl(key)
  },
}