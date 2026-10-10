// test/unit/utils/passwrod.test.ts
import { describe, it, expect } from 'vitest'
import { hashPassword, comparePassword } from '../../../src/common/utils/password'

describe('hashPasswrd / comparePassword', () => {
    it('produce a real argon2 hash not the plaintext passwrord', async () => {
     const hash = await hashPassword('123456Aa')
     expect(hash).not.toBe('123456Aa')
     expect(hash.startsWith('$argon2')).toBe(true)
    })

    it('returns true when comparing the correct passwrod against its own hash', async () => {
        const hash = await hashPassword('123456Aa')
        const result = await comparePassword('123456Aa', hash)
        expect(result).toBe(true)
    })

    it('returns false when comparing an incorrect password aginst the hash', async () =>{
        const hash = await hashPassword('123456Aa')
        const result = await comparePassword('wrong pass', hash)
        expect(result).toBe(false)
    })
 
})