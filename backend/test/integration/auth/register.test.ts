// test/integration/auth/refreshToken.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { connectTestDb, clearTestDb, disconnectTestDb } from '../../helpers/testDb.js';
import { User} from '../../../src/modules/user/user.model.js';
import { authService } from '../../../src/modules/auth/auth.service.js';
 
describe('authService.register', () => {
  beforeAll( async () => {
    await connectTestDb()
  })
  beforeEach( async () => {
    await clearTestDb()
  })
  afterAll( async () => {
    await disconnectTestDb()
  })

  it('it create a new user with hashed otp, and future expiry when user register with new email', async () => {

    await authService.register({
      name:'janzo',
      email:'janzo@gmail.com',
      password:'123456Aa'
    })
   
    const result = await User.findOne({email:'janzo@gmail.com'}).select('+otpCodeHash +otpExpiry')


    expect(result).not.toBeNull()
    expect(result?.name).toBe('janzo')
    expect(result?.email).toBe('janzo@gmail.com')
    expect(result?.emailVerified).toBe(false)
   
    expect(result?.otpCodeHash).toBeDefined()
    expect(result?.otpCodeHash).toHaveLength(64)
    expect(result?.otpExpiry).toBeInstanceOf(Date)
    expect(result?.otpExpiry!.getTime()).toBeGreaterThan(Date.now())
      

  })
  it('regenerates the OTP for an existing but unverified user re-registering', async () => {
    const existingUser = await User.create({
      name: 'Old Name',
      email: 'sara@example.com',
      password: 'OldHashedPassword',
      emailVerified: false,
      otpCodeHash:'some-stale-hash-from -days-ago'
    })
    
    await authService.register({
      name: 'Sara New Name',
      email: 'sara@example.com',
      password:'NewStrongpass234'
    })

    const userAfter = await User.findOne({email:'sara@example.com'})
    expect(userAfter?._id.toString()).toBe(existingUser._id.toString())
    expect(userAfter?.name).toBe('Sara New Name')
  })

  it('throws a conflict error when the email is already is verified', async () => {
   const user =  await User.create({
      name:'Existing user',
      email: 'sara@example.com',
      password:'Samomea33'
    })
user!.emailVerified = true
await user!.save()
    await expect(
      authService.register({
        name:'sara',
        email:'sara@example.com',
        password:'Anotherpass234',
         
      })
    ).rejects.toThrow('Email is in use')
  })

})