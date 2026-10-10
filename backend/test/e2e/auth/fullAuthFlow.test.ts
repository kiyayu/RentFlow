// test/e2e/auth/fullAuthFlow.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import request from 'supertest'
import { connectTestDb, clearTestDb, disconnectTestDb , clearTestRateLimits} from '../../helpers/testDb.js'
import { buildTestApp, connectTestRedis, disconnectTestRedis  } from '../../helpers/testApp.js'
import { validRegisterInput } from '../../fixtures/users.js'
import { User } from '../../../src/modules/user/user.model.js'

const app = buildTestApp()

describe('full auth flow (E2E)', () => {
  beforeAll(async () => {
    await connectTestDb()
    await connectTestRedis()
  })

  beforeEach(async () => {
    await clearTestDb()
    await clearTestRateLimits()
  })

  afterAll(async () => {
    await disconnectTestDb()
    await disconnectTestRedis()
  })

  it('registers a new user over real HTTP and stores them correctly', async () => {
    const input = validRegisterInput()

    const res = await request(app).post('/api/auth/register').send(input)

    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.data.email).toBe(input.email)
    expect(res.body.data.emailVerified).toBe(false)

    const userInDb = await User.findOne({ email: input.email })
    expect(userInDb).not.toBeNull()
  })

  it('blocks login over real HTTP when the email is not yet verified', async () => {
    const input = validRegisterInput()
    await request(app).post('/api/auth/register').send(input)

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: input.email, password: input.password })

    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
  })

  it('rejects a second registration attempt once the email is already verified', async () => {
    const input = validRegisterInput()
    await request(app).post('/api/auth/register').send(input)
    await User.updateOne({ email: input.email }, { emailVerified: true })

    const res = await request(app).post('/api/auth/register').send(input)

    expect(res.status).toBe(409)
    expect(res.body.success).toBe(false)
  })
})