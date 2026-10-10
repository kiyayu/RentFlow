// test/integration/auth/login.test.ts
import { describe, it, expect, afterAll, beforeAll, beforeEach } from 'vitest'
import { connectTestDb, clearTestDb, disconnectTestDb } from '../../helpers/testDb.js'
import { authService } from '../../../src/modules/auth/auth.service.js'
import { User } from '../../../src/modules/user/user.model.js'
import { hashPassword } from '../../../src/common/utils/password.js'

const fakeData = { ip: '127.0.0.1', userAgent: 'test-agent', label: 'test' }

describe('authService.login', () => {
  beforeAll(async () => {
    await connectTestDb()
  })

  beforeEach(async () => {
    await clearTestDb()
  })

  afterAll(async () => {
    await disconnectTestDb()
  })

  it('throws when no user exists with the given email', async () => {
    await expect(
      authService.login({ email: 'wrongemail@gmail.com', password: '1234feAaw' }, fakeData)
    ).rejects.toThrow('Invalid credentials')
  })

  it('throws when the account has been deactivated', async () => {
    const hash = await hashPassword('123456Aa')
    await User.create({
      name: 'testName',
      email: 'deactivated@gmail.com',
      password: hash,
      isActive: false,
    })
 
 
    await expect(
      authService.login({ email: 'deactivated@gmail.com', password: '123456Aa' }, fakeData)
    ).rejects.toThrow('Account is deactivated')
  })

  it('throws when the user has no password (Google-only account)', async () => {
    await User.create({
      name: 'Google User',
      email: 'googleuser@gmail.com',
      googleId: 'some-fake-google-sub-id',
      emailVerified: true,
    })

    await expect(
      authService.login({ email: 'googleuser@gmail.com', password: 'anything' }, fakeData)
    ).rejects.toThrow('This account uses Google sign-in')
  })

  it('throws when the password does not match', async () => {
    const hash = await hashPassword('123456Aa')
    await User.create({
      name: 'test',
      email: 'wrongpass@gmail.com',
      password: hash,
      emailVerified: true,
    })

    await expect(
      authService.login({ email: 'wrongpass@gmail.com', password: 'wrongpassword' }, fakeData)
    ).rejects.toThrow('Invalid credentials')
  })

  it('throws when the password is correct but the email is not verified', async () => {
    const hash = await hashPassword('123456Aa')
    await User.create({
      name: 'test',
      email: 'unverified@gmail.com',
      password: hash,
      emailVerified: false,
    })

    await expect(
      authService.login({ email: 'unverified@gmail.com', password: '123456Aa' }, fakeData)
    ).rejects.toThrow('Please verify your email before logging in')
  })

  it('returns tokens and user data when credentials are correct and the account is verified', async () => {
    const hash = await hashPassword('123456Aa')
    await User.create({
      name: 'test',
      email: 'verified@gmail.com',
      password: hash,
      emailVerified: true,
    })
 
const check = await User.findOne({ email: 'verified@gmail.com' }).select('+password')
console.log('STORED PASSWORD VALUE:', check?.password)

    const result = await authService.login({ email: 'verified@gmail.com', password: '123456Aa' }, fakeData)

    expect(result).not.toBeNull()
    expect(result.accessToken).toBeDefined()
    expect(result.refreshToken).toBeDefined()
    expect(result.user.email).toBe('verified@gmail.com')
  })
})