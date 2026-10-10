// test/integration/auth/verifyOtp.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { connectTestDb, clearTestDb, disconnectTestDb } from '../../helpers/testDb.js'
import { User } from '../../../src/modules/user/user.model.js'
import { authService } from '../../../src/modules/auth/auth.service.js'
import { issueOtp } from '../../../src/modules/auth/auth.helpers.js'

describe('authService.verifyOtp', () => {
  beforeAll(async () => { await connectTestDb() })
  beforeEach(async () => { await clearTestDb() })
  afterAll(async () => { await disconnectTestDb() })

  it('throws when no user exists with the given email', async () => {
    await expect(authService.verifyOtp('nobody@example.com', '123456')).rejects.toThrow('User not found')
  })

  it('returns a quiet success message when the email is already verified', async () => {
    await User.create({ name: 'Sara', email: 'sara@example.com', password: 'x', emailVerified: true })
    const message = await authService.verifyOtp('sara@example.com', '123456')
    expect(message).toBe('Email is already verified')
  })

  it('throws when the code has expired', async () => {
    const otp = issueOtp()
    await User.create({
      name: 'Sara', email: 'sara@example.com', password: 'x', emailVerified: false,
      otpCodeHash: otp.hash,
      otpExpiry: new Date(Date.now() - 1000),
      otpAttempts: 0,
    })

    await expect(authService.verifyOtp('sara@example.com', otp.code)).rejects.toThrow('Code expired')
  })

  it('throws when the attempt cap has already been reached', async () => {
    const otp = issueOtp()
    await User.create({
      name: 'Sara', email: 'sara@example.com', password: 'x', emailVerified: false,
      otpCodeHash: otp.hash,
      otpExpiry: new Date(Date.now() + 60000),
      otpAttempts: 5,
    })

    await expect(authService.verifyOtp('sara@example.com', otp.code)).rejects.toThrow('Too many incorrect attempts')
  })

  it('increments the attempt counter and throws when the code is wrong', async () => {
    const otp = issueOtp()
    await User.create({
      name: 'Sara', email: 'sara@example.com', password: 'x', emailVerified: false,
      otpCodeHash: otp.hash,
      otpExpiry: new Date(Date.now() + 60000),
      otpAttempts: 0,
    })

    await expect(authService.verifyOtp('sara@example.com', '000000')).rejects.toThrow('Invalid code')

    const userAfter = await User.findOne({ email: 'sara@example.com' }).select('+otpAttempts')
    expect(userAfter?.otpAttempts).toBe(1)
  })

  it('verifies successfully and clears OTP fields when the code is correct', async () => {
    const otp = issueOtp()
    await User.create({
      name: 'Sara', email: 'sara@example.com', password: 'x', emailVerified: false,
      otpCodeHash: otp.hash,
      otpExpiry: new Date(Date.now() + 60000),
      otpAttempts: 0,
    })

    const message = await authService.verifyOtp('sara@example.com', otp.code)
    expect(message).toBe('Email verified successfully')

    const userAfter = await User.findOne({ email: 'sara@example.com' }).select('+otpCodeHash +otpExpiry')
    expect(userAfter?.emailVerified).toBe(true)
    expect(userAfter?.otpCodeHash).toBeUndefined()
  })
})