// test/unit/utils/jwt.test.ts
import { describe, it, expect } from 'vitest'
import { Types } from 'mongoose'
import { signAccessToken, verifyAccessToken } from '../../../src/common/utils/jwt.js'
import { jwtVerify } from 'jose'

describe('signAccessToken / verifyAccessToken', () => {
  it('signs a token that verifies successfully and returns the correct payload', async () => {
    const userId = new Types.ObjectId()
    const token = await signAccessToken('customer', userId, 'Sara Test', 'sara@example.com')

    const result = await verifyAccessToken(token)

    expect(result.id).toBe(userId.toString())
    expect(result.name).toBe('Sara Test')
    expect(result.email).toBe('sara@example.com')
    expect(result.role).toBe('customer')
  })

  it('embeds the subject as a real string, not an ObjectId', async () => {
    // this is the exact bug we caught earlier in refreshToken.test.ts —
    // this test exists specifically to make sure it can never come back
    const userId = new Types.ObjectId()
    const token = await signAccessToken('customer', userId, 'Sara Test', 'sara@example.com')

    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_ACCESS_SECRET))
    expect(typeof payload.sub).toBe('string')
  })

  it('throws when given a completely invalid token string', async () => {
    await expect(verifyAccessToken('not-a-real-token')).rejects.toThrow()
  })

  it('throws when the token was signed with a different secret', async () => {
    // simulate a forged/tampered token by signing with the WRONG key entirely
    const { SignJWT } = await import('jose')
    const wrongSecret = new TextEncoder().encode('a-completely-different-secret-thats-32-chars-long')

    const forgedToken = await new SignJWT({ role: 'admin', name: 'Fake', email: 'fake@example.com' })
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject('507f1f77bcf86cd799439011')
      .setIssuedAt()
      .setExpirationTime('15m')
      .sign(wrongSecret)

    await expect(verifyAccessToken(forgedToken)).rejects.toThrow()
  })

  it('throws when the payload is missing required claims', async () => {
    // a token that's validly SIGNED but doesn't carry the shape your app expects
    const { SignJWT } = await import('jose')
    const realSecret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET)

    const incompleteToken = await new SignJWT({ role: 'customer' }) // missing name, email
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject('507f1f77bcf86cd799439011')
      .setIssuedAt()
      .setExpirationTime('15m')
      .sign(realSecret)

    await expect(verifyAccessToken(incompleteToken)).rejects.toThrow('Invalid token payload structure')
  })
})