// test/integration/user/listUsers.test.ts
import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest'
import { connectTestDb, clearTestDb, disconnectTestDb } from '../../helpers/testDb.js'
import { userService } from '../../../src/modules/user/user.service.js'
import { User } from '../../../src/modules/user/user.model.js'

describe('userService.listUsers', () => {
  beforeAll(async () => { await connectTestDb() })
  beforeEach(async () => { await clearTestDb() })
  afterAll(async () => { await disconnectTestDb() })

  it('returns an empty list and zero total when there are no users', async () => {
    const result = await userService.listUsers(1, 20)
    expect(result.users).toHaveLength(0)
    expect(result.total).toBe(0)
  })

  it('returns the correct page of results and the correct total count', async () => {
    for (let i = 0; i < 5; i++) {
      await User.create({ name: `User ${i}`, email: `user${i}@example.com`, password: 'x' })
    }

    const page1 = await userService.listUsers(1, 2)
    expect(page1.users).toHaveLength(2)
    expect(page1.total).toBe(5) // total counts ALL users, not just this page

    const page2 = await userService.listUsers(2, 2)
    expect(page2.users).toHaveLength(2)

    const page3 = await userService.listUsers(3, 2)
    expect(page3.users).toHaveLength(1) // last page, only 1 remaining
  })

  it('never exposes sensitive fields in the listed results', async () => {
    await User.create({ name: 'Sara', email: 'sara@example.com', password: 'SuperSecretHash' })

    const result = await userService.listUsers(1, 20)
    expect((result.users[0] as any).password).toBeUndefined()
  })
})