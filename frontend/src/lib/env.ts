//src/lib/env.ts
import { z } from 'zod'

const schema = z.object({
  VITE_API_BASE_URL: z.string().url('VITE_API_BASE_URL must be a full URL'),
  VITE_DEFAULT_LANG: z.string().min(2).default('en'),
})

const parsed = schema.safeParse(import.meta.env)

if (!parsed.success) {
  const details = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('\n')
  throw new Error(`Invalid environment configuration:\n${details}`)
}

export const env = {
  apiBaseUrl: parsed.data.VITE_API_BASE_URL.replace(/\/?$/, '/'), // always ends with one slash
  defaultLang: parsed.data.VITE_DEFAULT_LANG,
}