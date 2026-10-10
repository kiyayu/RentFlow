import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest'
import { authService } from '../../../src/modules/auth/auth.service.js'
import { hashPassword } from '../../../src/common/utils/password.js'
import { connectTestDb, clearTestDb, disconnectTestDb } from '../../helpers/testDb.js'
import { User } from '../../../src/modules/user/user.model.js'
import { GENERIC_RESET_MESSAGE } from '../../../src/modules/auth/auth.constants'
const name ='test'
const email = 'test@gmail.com'
const password = '123456Aa'
 
describe('authService.forgotPassword', () => {

    beforeAll(async () => {
        await connectTestDb()
    })
    beforeEach(async () => {
        await clearTestDb()
    })
    afterAll(async () => {
        await disconnectTestDb()
    })

    it('returns generic message when user dose not exist ', async () => {
        const result = await authService.forgotPassword('ghost@gmail.com')

        expect(result).toBe(GENERIC_RESET_MESSAGE)
    })
    it('issues token and saves it to the database when use rexists', async () => {
        await User.create({
            name,
            email,
            password: await hashPassword(password),
            emailVerified:true
        })

        const result = await authService.forgotPassword(email)
        expect(result).toBe(GENERIC_RESET_MESSAGE)
        const updatedUser = await User.findOne({ email }).select('+passwordResetToken +passwordResetExpiry')
        expect(updatedUser).not.toBeNull()
        expect(updatedUser!.passwordResetToken).toBeDefined()
        expect(updatedUser!.passwordResetExpiry).toBeInstanceOf(Date)
     })

  
})