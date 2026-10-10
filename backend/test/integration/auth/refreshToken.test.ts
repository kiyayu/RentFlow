// test/integration/auth/refreshToken.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { connectTestDb, clearTestDb, disconnectTestDb } from '../../helpers/testDb.js'
import { User, TokenFamily } from '../../../src/modules/user/user.model.js'
import { authService } from '../../../src/modules/auth/auth.service.js'
import { sha256 } from '../../../src/modules/auth/auth.helpers.js'

const createTestUser = async () => {
  return User.create({
    name: 'Test User',
    email: `refresh-test-${Date.now()}-${Math.random()}@example.com`,
    password: 'irrelevant-for-this-test',
    emailVerified: true,
    role: 'customer',
  })
}

describe('authService.refreshToken', () => {
  beforeAll(async () => {
    await connectTestDb()
  })

  beforeEach(async () => {
    await clearTestDb()
  })

  afterAll(async () => {
    await disconnectTestDb()
  })

  it('rotates the token and returns new tokens when given a valid, current refresh token', async () => {
    const user = await createTestUser()
    const rawToken = 'the-current-valid-raw-token'

    await TokenFamily.create({
      userId: user._id,
      currentTokenHash: sha256(rawToken),
      lastUsedAt: new Date(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    })

    const result = await authService.refreshToken(rawToken)

    expect(result.accessToken).toBeDefined()
    expect(result.refreshToken).toBeDefined()
    expect(result.refreshToken).not.toBe(rawToken)

    const familyAfter = await TokenFamily.findOne({ userId: user._id }).select('+previousTokenHash +currentTokenHash')
    expect(familyAfter?.previousTokenHash).toBe(sha256(rawToken))
    expect(familyAfter?.currentTokenHash).toBe(sha256(result.refreshToken!))
  })

  it('returns a fresh access token without rotating again when the same old token is reused within the grace window', async () => {
    const user = await createTestUser()
    const rawToken = 'the-current-valid-raw-token'

    await TokenFamily.create({
      userId: user._id,
      currentTokenHash: sha256(rawToken),
     
      lastUsedAt: new Date(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    })

    const result1 = await authService.refreshToken(rawToken)
    const result2 = await authService.refreshToken(rawToken)

    expect(result2.accessToken).toBeDefined()
    expect(result2.refreshToken).toBeUndefined()

    const familyAfter = await TokenFamily.findOne({ userId: user._id }).select('+previousTokenHash +currentTokenHash')
    expect(familyAfter?.currentTokenHash).toBe(sha256(result1.refreshToken!))
    expect(familyAfter?.revokedAt).toBeNull()
  })

  it('revokes the family and throws when a stale token is replayed past the grace window', async () => {
    const user = await createTestUser()
    const rawOldToken = 'some-old-raw-token-value'
    const staleTime = new Date(Date.now() - 60_000) // 60s ago — past the 10s grace window

    await TokenFamily.create({
      userId: user._id,
      currentTokenHash: sha256('a-newer-current-token'),
      previousTokenHash: sha256(rawOldToken),
     
      lastUsedAt: staleTime,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    })

    await expect(authService.refreshToken(rawOldToken)).rejects.toThrow('Session invalid')

    const familyAfter = await TokenFamily.findOne({ previousTokenHash: sha256(rawOldToken) }).select('+previousTokenHash +currentTokenHash')
    expect(familyAfter?.revokedAt).not.toBeNull()
  })

  it('throws when the token matches no family at all', async () => {
    await expect(authService.refreshToken('completely-made-up-token')).rejects.toThrow('Invalid refresh token')
  })
})