// test/integration/user/hardDelete.test.ts
import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest'
import { connectTestDb, clearTestDb, disconnectTestDb } from '../../helpers/testDb.js'
import { userService } from '../../../src/modules/user/user.service.js'
import { User, TokenFamily } from '../../../src/modules/user/user.model.js'
import { sha256 } from '../../../src/modules/auth/auth.helpers.js'

describe('userService.hardDelete', () => {
  beforeAll(async () => { await connectTestDb() })
  beforeEach(async () => { await clearTestDb() })
  afterAll(async () => { await disconnectTestDb() })

  it('throws when no user exists with that id', async () => {
    const fakeId = '507f1f77bcf86cd799439011'
    await expect(userService.hardDelete(fakeId)).rejects.toThrow('User not found')
  })

  it('permanently removes the user AND every associated session', async () => {
    const user = await User.create({ name: 'Sara', email: 'sara@example.com', password: 'x' })
    await TokenFamily.create({
      userId: user._id, currentTokenHash: sha256('some-token'),
      lastUsedAt: new Date(), expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    })

    const message = await userService.hardDelete(user._id.toString())
    expect(message).toBe('Account permanently deleted')

    const dbUser = await User.findById(user._id)
    expect(dbUser).toBeNull()

    const remainingSessions = await TokenFamily.countDocuments({ userId: user._id })
    expect(remainingSessions).toBe(0)
  })
})