//src/config/env.ts
import dotenv from 'dotenv'
import path from 'node:path'
import { z } from 'zod'

import type { EnvTypes } from '../types/envTypes.js'

dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
})

const nonEmptyString = z.string().trim().min(1)

const secret = z
  .string()
  .min(32, 'Secret must contain at least 32 characters')

const port = z.coerce
  .number()
  .int()
  .min(1)
  .max(65535)

const envSchema = z
  .object({
    PORT: port.default(5000),

    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),

    MONGO_URL: z
      .string()
      .url()
      .refine(
        (value) =>
          value.startsWith('mongodb://') ||
          value.startsWith('mongodb+srv://'),
        'MONGO_URL must use mongodb:// or mongodb+srv://',
      ),

    REDIS_URL: z
      .string()
      .url()
      .refine(
        (value) =>
          value.startsWith('redis://') ||
          value.startsWith('rediss://'),
        'REDIS_URL must use redis:// or rediss://',
      ),

    JWT_ACCESS_SECRET: secret,
    JWT_REFRESH_SECRET: secret,

    JWT_ACCESS_EXPIRES_IN: nonEmptyString,
    JWT_REFRESH_EXPIRES_IN: nonEmptyString,

    CLIENT_URL: z.string().url(),

    COOKIE_SECRET: secret,

    SMTP_HOST: nonEmptyString,
    SMTP_PORT: port.default(587),
    SMTP_USER: nonEmptyString,
    SMTP_PASS: nonEmptyString,
    SMTP_FROM: nonEmptyString,

    GOOGLE_CLIENT_ID: nonEmptyString,
    GOOGLE_CLIENT_SECRET: nonEmptyString,
    GOOGLE_REDIRECT_URI: z.string().url(),

    STORAGE_DRIVER: z
      .enum(['cloudinary', 'fake'])
      .default('fake'),

    CLOUDINARY_CLOUD_NAME: z.string().optional(),
    CLOUDINARY_API_KEY: z.string().optional(),
    CLOUDINARY_API_SECRET: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    if (
      values.JWT_ACCESS_SECRET === values.JWT_REFRESH_SECRET
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['JWT_REFRESH_SECRET'],
        message: 'Access and refresh secrets must be different',
      })
    }

    if (
      values.NODE_ENV === 'production' &&
      !values.CLIENT_URL.startsWith('https://')
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['CLIENT_URL'],
        message: 'CLIENT_URL must use HTTPS in production',
      })
    }

    if (
      values.NODE_ENV === 'production' &&
      values.STORAGE_DRIVER === 'fake'
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['STORAGE_DRIVER'],
        message: 'Fake storage is not allowed in production',
      })
    }

    if (values.STORAGE_DRIVER === 'cloudinary') {
      const requiredCloudinaryValues = [
        'CLOUDINARY_CLOUD_NAME',
        'CLOUDINARY_API_KEY',
        'CLOUDINARY_API_SECRET',
      ] as const

      for (const key of requiredCloudinaryValues) {
        if (!values[key]?.trim()) {
          ctx.addIssue({
            code: 'custom',
            path: [key],
            message: `${key} is required when using Cloudinary`,
          })
        }
      }
    }
  })

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('Invalid environment configuration:')

  for (const issue of parsed.error.issues) {
    console.error(`- ${issue.path.join('.')}: ${issue.message}`)
  }

  process.exit(1)
}

export const env: EnvTypes = {
  port: parsed.data.PORT,
  nodeEnv: parsed.data.NODE_ENV,

  mongoUri: parsed.data.MONGO_URL,
  redisUri: parsed.data.REDIS_URL,

  jwtAccessSecret: parsed.data.JWT_ACCESS_SECRET,
  jwtRefreshSecret: parsed.data.JWT_REFRESH_SECRET,
  jwtAccessExpiresIn: parsed.data.JWT_ACCESS_EXPIRES_IN,
  jwtRefreshExpiresIn: parsed.data.JWT_REFRESH_EXPIRES_IN,

  clientUrl: parsed.data.CLIENT_URL,
  cookieSecret: parsed.data.COOKIE_SECRET,

  smtpHost: parsed.data.SMTP_HOST,
  smtpPort: parsed.data.SMTP_PORT,
  smtpUser: parsed.data.SMTP_USER,
  smtpPass: parsed.data.SMTP_PASS,
  smtpFrom: parsed.data.SMTP_FROM,

  googleClientId: parsed.data.GOOGLE_CLIENT_ID,
  googleClientSecret: parsed.data.GOOGLE_CLIENT_SECRET,
  googleRedirectUri: parsed.data.GOOGLE_REDIRECT_URI,

  storageDriver: parsed.data.STORAGE_DRIVER,
  cloudinaryCloudName: parsed.data.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: parsed.data.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: parsed.data.CLOUDINARY_API_SECRET,
}