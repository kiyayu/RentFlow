//src/config/redis.ts
import { createClient } from "redis"
import { logger } from "../common/utils/logger.js"
import { env } from "./env.js"

const client = createClient({
    url: env.redisUri,
    socket: env.redisUri.startsWith('rediss://')
      ? { tls: true as const, rejectUnauthorized: false }
      : undefined
})

client.on('error', (err) => logger.error({ err }, 'Redis client error'))
client.on('connect', () => logger.info("Redis connected"))
client.on('reconnecting', () => logger.warn('Redis reconnecting...'))

export const connectRedis = async (): Promise<void> => {
    // Safety check: Prevent connecting if already connected or connecting
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
    set: async (key: string, value: string, ttlSeconds: number): Promise<void> => {
        await client.setEx(key, ttlSeconds, value)
    },
    get: async (key: string): Promise<string | null> => {
        return client.get(key)
    },
    delete: async (key: string): Promise<void> => {
        await client.del(key)
    },
    increment: async (key: string, ttlSeconds: number): Promise<number> => {
        const count = await client.incr(key)
        if (count === 1) {
            await client.expire(key, ttlSeconds)
        }
        return count
    },
    ttl: async (key: string): Promise<number> => {
        return client.ttl(key)
    }
}