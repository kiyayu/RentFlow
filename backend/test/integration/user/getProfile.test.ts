// test/integration/user/getProfile.test.ts
import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest'
import { connectTestDb, clearTestDb, disconnectTestDb } from '../../helpers/testDb.js'
import { userService } from '../../../src/modules/user/user.service.js'
import { User } from '../../../src/modules/user/user.model.js'

describe('userService.getProfile', () => {
  beforeAll(async () => { await connectTestDb() })
  beforeEach(async () => { await clearTestDb() })
  afterAll(async () => { await disconnectTestDb() })

  it('throws when no user exists with that id', async () => {
    const fakeId = '507f1f77bcf86cd799439011'
    await expect(userService.getProfile(fakeId)).rejects.toThrow('User not found')
  })

  it('returns the sanitized profile for an existing user', async () => {
    const user = await User.create({
      name: 'Sara',
      email: 'sara@example.com',
      password: 'irrelevant',
      role: 'customer',
      emailVerified: true,
    })

    const result = await userService.getProfile(user._id.toString())

    expect(result.id).toBe(user._id.toString())
    expect(result.email).toBe('sara@example.com')
    expect(result.name).toBe('Sara')
    expect(result.role).toBe('customer')
    // proves sanitization actually happened — a raw document would carry this
    expect((result as any).password).toBeUndefined()
  })
})