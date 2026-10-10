// test/integration/auth/resendOtp.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { connectTestDb, clearTestDb, disconnectTestDb } from '../../helpers/testDb.js'
import { User } from '../../../src/modules/user/user.model.js'
import { authService } from '../../../src/modules/auth/auth.service.js'

describe('authService.resendOtp', () => {
  beforeAll(async () => { await connectTestDb() })
  beforeEach(async () => { await clearTestDb() })
  afterAll(async () => { await disconnectTestDb() })

  it('throws when no user exists with the given email', async () => {
    await expect(authService.resendOtp('nobody@example.com')).rejects.toThrow('User not found')
  })

  it('returns a quiet success message when already verified', async () => {
    await User.create({ name: 'Sara', email: 'sara@example.com', password: 'x', emailVerified: true })
    const message = await authService.resendOtp('sara@example.com')
    expect(message).toBe('User email already verified')
  })

  it('throws when a code was sent too recently', async () => {
    await User.create({
      name: 'Sara', email: 'sara@example.com', password: 'x', emailVerified: false,
      lastOtpSentAt: new Date(), // sent right now
    })

    await expect(authService.resendOtp('sara@example.com')).rejects.toThrow('Please wait')
  })

  it('sends a new code when the cooldown has passed', async () => {
    await User.create({
      name: 'Sara', email: 'sara@example.com', password: 'x', emailVerified: false,
      lastOtpSentAt: new Date(Date.now() - 120_000), // 2 minutes ago, past the 60s cooldown
    })

    const message = await authService.resendOtp('sara@example.com')
    expect(message).toBe('Please check your email inbox')

    const userAfter = await User.findOne({ email: 'sara@example.com' }).select('+otpCodeHash +otpAttempts')
    expect(userAfter?.otpCodeHash).toBeDefined()
    expect(userAfter?.otpAttempts).toBe(0)
  })
})