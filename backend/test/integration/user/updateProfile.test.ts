// test/integration/user/updateProfile.test.ts
import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest'
import { connectTestDb, clearTestDb, disconnectTestDb } from '../../helpers/testDb.js'
import { userService } from '../../../src/modules/user/user.service.js'
import { User } from '../../../src/modules/user/user.model.js'

describe('userService.updateProfile', () => {
  beforeAll(async () => { await connectTestDb() })
  beforeEach(async () => { await clearTestDb() })
  afterAll(async () => { await disconnectTestDb() })

  it('throws when no user exists with that id', async () => {
    const fakeId = '507f1f77bcf86cd799439011'
    await expect(userService.updateProfile(fakeId, { name: 'New Name' })).rejects.toThrow('User not found')
  })

  it('updates the name and returns the sanitized profile', async () => {
    const user = await User.create({ name: 'Old Name', email: 'sara@example.com', password: 'x' })

    const result = await userService.updateProfile(user._id.toString(), { name: 'New Name' })

    expect(result.name).toBe('New Name')

    const dbUser = await User.findById(user._id)
    expect(dbUser?.name).toBe('New Name')
  })

  it('leaves the name unchanged when no name is provided', async () => {
    const user = await User.create({ name: 'Untouched Name', email: 'sara@example.com', password: 'x' })

    await userService.updateProfile(user._id.toString(), {})

    const dbUser = await User.findById(user._id)
    expect(dbUser?.name).toBe('Untouched Name')
  })
})