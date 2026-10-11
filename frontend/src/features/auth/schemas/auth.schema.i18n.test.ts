//src/features/auth/schemas/auth.schema.i18n.test.ts
import { it, expect } from 'vitest'
import { i18n } from '@/lib/i18n'
import { loginSchema, registerSchema, resetPasswordSchema } from './auth.schema'

// Every message a schema can produce must resolve to real text, not a raw key.
it('every schema message is a real translation key', () => {
  const results = [
    loginSchema.safeParse({ email: '', password: '' }),
    registerSchema.safeParse({ name: 'a', email: 'x', password: 'a' }),
    resetPasswordSchema.safeParse({ newPassword: 'Aa1aaaaa', confirmPassword: 'other' }),
  ]
  for (const result of results) {
    if (result.success) continue
    for (const issue of result.error.issues) {
      expect(i18n.exists(issue.message), issue.message).toBe(true)
    }
  }
})