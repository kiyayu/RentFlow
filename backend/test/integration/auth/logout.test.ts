import {describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest'
import {connectTestDb, clearTestDb, disconnectTestDb} from '../../helpers/testDb.js'
import { authService } from '../../../src/modules/auth/auth.service.js'
import { hashPassword } from '../../../src/common/utils/password.js'
import { User , TokenFamily} from '../../../src/modules/user/user.model.js'
const fakeData = {ip:'128,0,0,0', userAgent:'test-aget', label:'test-label'}
beforeAll( async () => {
    await connectTestDb()
})

beforeEach(async () => {
    await clearTestDb()
})

afterAll(async () => {
   await disconnectTestDb()
})

describe('authService.logout', () => {

    it('returns true when given an invalid token', async () => {
      const result = await authService.logout('randomToken')
      
      expect(result).toBe(true)
        
    })
it('deletes the matching token family when given a valid token', async () => {
  const user = await User.create({
    name: 'test1',
    email: 'test1@gmail.com',
    password: await hashPassword('123456Aa'),
    emailVerified: true,
  })

  const { refreshToken } = await authService.login({ email: 'test1@gmail.com', password: '123456Aa' }, fakeData)

  const beforeCount = await TokenFamily.countDocuments({ userId: user._id })
  expect(beforeCount).toBe(1)

  const result = await authService.logout(refreshToken)
  expect(result).toBe(true)

  const afterCount = await TokenFamily.countDocuments({ userId: user._id })
  expect(afterCount).toBe(0)
})
})

