// test/integration/user/changeEmail.test.ts
import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest'
import { connectTestDb, clearTestDb, disconnectTestDb } from '../../helpers/testDb.js'
import { userService } from '../../../src/modules/user/user.service.js'
import { User } from '../../../src/modules/user/user.model.js'

describe('userService.changeEmail', () => {
  beforeAll(async () => { await connectTestDb() })
  beforeEach(async () => { await clearTestDb() })
  afterAll(async () => { await disconnectTestDb() })

  it('throws when the new email is the same as the current one', async () => {
    const user = await User.create({ name: 'Sara', email: 'sara@example.com', password: 'x' })

    await expect(
      userService.changeEmail(user._id.toString(), 'sara@example.com')
    ).rejects.toThrow('This is already your email')
  })

  it('throws when the new email already belongs to someone else', async () => {
    await User.create({ name: 'Other', email: 'taken@example.com', password: 'x' })
    const user = await User.create({ name: 'Sara', email: 'sara@example.com', password: 'x' })

    await expect(
      userService.changeEmail(user._id.toString(), 'taken@example.com')
    ).rejects.toThrow('Email already in use')
  })

  it('updates the email and forces re-verification', async () => {
    const user = await User.create({
      name: 'Sara', email: 'sara@example.com', password: 'x', emailVerified: true,
    })

    const message = await userService.changeEmail(user._id.toString(), 'newsara@example.com')
    expect(message).toContain('Email updated')

    const dbUser = await User.findById(user._id).select('+otpCodeHash +otpExpiry')
    expect(dbUser?.email).toBe('newsara@example.com')
    expect(dbUser?.emailVerified).toBe(false) // this is the "high-risk" behavior we specifically designed
    expect(dbUser?.otpCodeHash).toBeDefined() // a fresh OTP cycle was actually triggered
  })
})