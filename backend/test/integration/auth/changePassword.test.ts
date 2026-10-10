// test/integration/auth/changePassword.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { connectTestDb, clearTestDb, disconnectTestDb } from '../../helpers/testDb.js'
import { User, TokenFamily } from '../../../src/modules/user/user.model.js'
import { authService } from '../../../src/modules/auth/auth.service.js'
import { hashPassword, comparePassword } from '../../../src/common/utils/password.js'
import { sha256 } from '../../../src/modules/auth/auth.helpers.js'

describe('authService.changePassword', () => {
  beforeAll(async () => { await connectTestDb() })
  beforeEach(async () => { await clearTestDb() })
  afterAll(async () => { await disconnectTestDb() })

  it('throws when the user has a password but none was supplied', async () => {
    const user = await User.create({
      name: 'Sara', email: 'sara@example.com', password: await hashPassword('OldPass123'),
    })

    await expect(
      authService.changePassword(user._id.toString(), undefined, 'NewPass123', null)
    ).rejects.toThrow('Current password is required')
  })

  it('throws when the current password is wrong', async () => {
    const user = await User.create({
      name: 'Sara', email: 'sara@example.com', password: await hashPassword('OldPass123'),
    })

    await expect(
      authService.changePassword(user._id.toString(), 'WrongOldPass', 'NewPass123', null)
    ).rejects.toThrow('Current password is incorrect')
  })

  it('sets a password directly for a Google-only user with no current password check', async () => {
    const user = await User.create({
      name: 'Sara', email: 'sara@example.com', googleId: 'fake-google-sub', emailVerified: true,
    })

    const message = await authService.changePassword(user._id.toString(), undefined, 'NewPass123', null)
    expect(message).toBe('Password updated successfully')

    const userAfter = await User.findOne({ email: 'sara@example.com' }).select('+password')
    const matches = await comparePassword('NewPass123', userAfter!.password!)
    expect(matches).toBe(true)
  })

  it('updates the password and revokes every OTHER session but keeps the current one', async () => {
    const user = await User.create({
      name: 'Sara', email: 'sara@example.com', password: await hashPassword('OldPass123'),
    })

    const currentFamily = await TokenFamily.create({
      userId: user._id, currentTokenHash: sha256('current-device-token'),
      lastUsedAt: new Date(), expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    })
    const otherFamily = await TokenFamily.create({
      userId: user._id, currentTokenHash: sha256('other-device-token'),
      lastUsedAt: new Date(), expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    })

    await authService.changePassword(user._id.toString(), 'OldPass123', 'NewPass123', currentFamily._id.toString())

    const currentStillExists = await TokenFamily.findById(currentFamily._id)
    const otherStillExists = await TokenFamily.findById(otherFamily._id)

    expect(currentStillExists).not.toBeNull()   // current device survives
    expect(otherStillExists).toBeNull()           // other device got kicked
  })
})