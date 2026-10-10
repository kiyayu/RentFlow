// test/integration/auth/resetPassword.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { connectTestDb, clearTestDb, disconnectTestDb } from '../../helpers/testDb.js'
import { User, TokenFamily } from '../../../src/modules/user/user.model.js'
import { authService } from '../../../src/modules/auth/auth.service.js'
import { sha256, issueOpaqueToken } from '../../../src/modules/auth/auth.helpers.js'
import { hashPassword, comparePassword } from '../../../src/common/utils/password.js'

describe('authService.resetPassword', () => {
  beforeAll(async () => { await connectTestDb() })
  beforeEach(async () => { await clearTestDb() })
  afterAll(async () => { await disconnectTestDb() })

  it('throws when the reset token matches no user', async () => {
    await expect(
      authService.resetPassword('completely-made-up-token', 'NewPass123')
    ).rejects.toThrow('Invalid reset token')
  })

  it('throws when the reset token has expired', async () => {
    const { raw, hash } = issueOpaqueToken()
    await User.create({
      name: 'Sara',
      email: 'sara@example.com',
      password: await hashPassword('OldPass123'),
      passwordResetToken: hash,
      passwordResetExpiry: new Date(Date.now() - 1000), // already in the past
    })

    await expect(
      authService.resetPassword(raw, 'NewPass123')
    ).rejects.toThrow('Reset token has expired')
  })

  it('resets the password, clears the token, and revokes all sessions when the token is valid', async () => {
    const { raw, hash } = issueOpaqueToken()
    const user = await User.create({
      name: 'Sara',
      email: 'sara@example.com',
      password: await hashPassword('OldPass123'),
      passwordResetToken: hash,
      passwordResetExpiry: new Date(Date.now() + 60 * 60 * 1000),
    })

    await TokenFamily.create({
      userId: user._id,
      currentTokenHash: sha256('some-active-session-token'),
      lastUsedAt: new Date(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    })

    const message = await authService.resetPassword(raw, 'NewPass123')
    expect(message).toContain('Password reset successfully')

    const userAfter = await User.findOne({ email: 'sara@example.com' }).select('+password +passwordResetToken')
    const passwordMatches = await comparePassword('NewPass123', userAfter!.password!)
    expect(passwordMatches).toBe(true)
    expect(userAfter?.passwordResetToken).toBeUndefined()

    const remainingSessions = await TokenFamily.countDocuments({ userId: user._id })
    expect(remainingSessions).toBe(0)
  })
})