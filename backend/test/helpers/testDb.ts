// test/helpers/testDb.ts
import mongoose from 'mongoose'
import { redis as redisClient } from '../../src/config/redis.js'
export const connectTestDb = async () => {
  await mongoose.connect('mongodb://localhost:27017/sandbox-test')
}

export const clearTestDb = async () => {
  const collections = mongoose.connection.collections
  for (const key in collections) {
    await collections[key].deleteMany({})
  }
}

export const disconnectTestDb = async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.disconnect()
}



export const clearTestRateLimits = async () => {
  // your rate limiter keys are named `rateLimiter:{identifier}:{ip}`
  await redisClient.delete('rateLimiter:register:::ffff:127.0.0.1')
  await redisClient.delete('rateLimiter:login:::ffff:127.0.0.1')
}