//test/integration/auth/googleAuth.test.ts
import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest'
import { connectTestDb, clearTestDb, disconnectTestDb } from '../../helpers/testDb.js'
import { authService } from '../../../src/modules/auth/auth.service.js'
import { User } from '../../../src/modules/user/user.model.js'
import { hashPassword } from '../../../src/common/utils/password.js'

const fakeMetadata = { ip: '127.0.0.1', userAgent: 'test-agent', label: 'test-label' }

const baseGoogleUser = {
  sub: 'google-uid-12345',
  email: 'googleuser@gmail.com',
  name: 'Google User',
  email_verified: true,
}

describe('authService.googleAuth', () => {
  beforeAll(async () => { await connectTestDb() })
  beforeEach(async () => { await clearTestDb() })
  afterAll(async () => { await disconnectTestDb() })

  it('throws when Google reports the email as unverified', async () => {
    const unverifiedGoogleUser = { ...baseGoogleUser, email_verified: false }
    await expect(
      authService.googleAuth(unverifiedGoogleUser, fakeMetadata)
    ).rejects.toThrow('Google account email is not verified')
  })

  it('creates a new user in DB and returns tokens when user does not exist', async () => {
    const result = await authService.googleAuth(baseGoogleUser, fakeMetadata)

    expect(result.user.email).toBe(baseGoogleUser.email)
    expect(result.accessToken).toBeDefined()
    expect(result.refreshToken).toBeDefined()

    const dbUser = await User.findOne({ email: baseGoogleUser.email }).select('+googleId')
    expect(dbUser).not.toBeNull()
    expect(dbUser!.googleId).toBe(baseGoogleUser.sub)
    expect(dbUser!.emailVerified).toBe(true)
  })

  it('links googleId to existing password user and verifies their email', async () => {
    // FIXED — this user needs a real password, since they have no googleId yet
    // and the schema requires at least one of the two
    await User.create({
      name: 'Existing User',
      email: baseGoogleUser.email,
      password: await hashPassword('SomeRealPass123'),
      emailVerified: false,
    })

    await authService.googleAuth(baseGoogleUser, fakeMetadata)

    const updatedUser = await User.findOne({ email: baseGoogleUser.email }).select('+googleId')
    expect(updatedUser!.googleId).toBe(baseGoogleUser.sub)
    expect(updatedUser!.emailVerified).toBe(true)
  })

  it('throws forbidden error if existing user account is deactivated', async () => {
    // FIXED — same schema requirement, needs a real password
    await User.create({
      name: 'Deactivated User',
      email: baseGoogleUser.email,
      password: await hashPassword('SomeRealPass123'),
      isActive: false,
    })

    await expect(
      authService.googleAuth(baseGoogleUser, fakeMetadata)
    ).rejects.toThrow(/Account is deactivated/i)
  })

  it('throws unauthorized error if email matches but googleId does not match', async () => {
    await User.create({
      name: 'Linked User',
      email: baseGoogleUser.email,
      googleId: 'different-google-sub-99999',
      emailVerified: true,
    })

    await expect(
      authService.googleAuth(baseGoogleUser, fakeMetadata)
    ).rejects.toThrow(/Invalid authorization/i)
  })

  it('logs in successfully when the googleId already matches on a returning user', async () => {
    await User.create({
      name: 'Returning User',
      email: baseGoogleUser.email,
      googleId: baseGoogleUser.sub,
      emailVerified: true,
    })

    const result = await authService.googleAuth(baseGoogleUser, fakeMetadata)
    expect(result.user.email).toBe(baseGoogleUser.email)

    const count = await User.countDocuments({ email: baseGoogleUser.email })
    expect(count).toBe(1)
  })
})