//test/integration/user/avatar.test.ts
import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest'
import { vi } from 'vitest'
vi.hoisted(() => { process.env.STORAGE_DRIVER = 'fake' })

import { connectTestDb, clearTestDb, disconnectTestDb } from '../../helpers/testDb'
import { User } from '../../../src/modules/user/user.model'
import { userService } from '../../../src/modules/user/user.service'
import { uploadService } from '../../../src/modules/upload/upload.service'
import { fakeStorage } from '../../../src/modules/upload/storage'

const png = { purpose: 'avatar' as const, contentType: 'image/png', size: 1000 }

const makeUser = () =>
  User.create({ name: 'Test User', email: `t${Date.now()}${Math.random()}@x.com`, password: 'hash', emailVerified: true })

const stage = (userId: string) => {
  const { fileKey } = uploadService.sign(userId, png)
  fakeStorage.simulateUpload(fileKey, { bytes: 1000, format: 'png', url: `https://cdn/${fileKey}.png` })
  return fileKey
}

describe('user avatar', () => {
  beforeAll(async () => connectTestDb())
  beforeEach(async () => { await clearTestDb(); fakeStorage.files.clear() })
  afterAll(async () => disconnectTestDb())

  it('saves the avatar url from storage', async () => {
    const user = await makeUser()
    const key = stage(user.id)
    const r = await userService.setAvatar(user.id, key)
    expect(r.avatarUrl).toBe(`https://cdn/${key}.png`)
  })

  it('deletes the previous file when replaced', async () => {
    const user = await makeUser()
    const first = stage(user.id)
    await userService.setAvatar(user.id, first)
    const second = stage(user.id)
    await userService.setAvatar(user.id, second)
    await new Promise((r) => setTimeout(r, 10))
    expect(fakeStorage.files.has(first)).toBe(false)
    expect(fakeStorage.files.has(second)).toBe(true)
  })

  it('rejects a key owned by another user', async () => {
    const user = await makeUser()
    const other = await makeUser()
    const key = stage(other.id)
    await expect(userService.setAvatar(user.id, key)).rejects.toThrow(/not found/i)
  })

  it('does not save when the file breaks a rule', async () => {
    const user = await makeUser()
    const { fileKey } = uploadService.sign(user.id, png)
    fakeStorage.simulateUpload(fileKey, { bytes: 9 * 1024 * 1024, format: 'png', url: 'u' })
    await expect(userService.setAvatar(user.id, fileKey)).rejects.toThrow(/too large/i)
    const fresh = await User.findById(user.id)
    expect(fresh?.avatarUrl).toBeUndefined()
  })

  it('removes the avatar and its file', async () => {
    const user = await makeUser()
    const key = stage(user.id)
    await userService.setAvatar(user.id, key)
    const r = await userService.removeAvatar(user.id)
    await new Promise((r) => setTimeout(r, 10))
    expect(r.avatarUrl).toBeUndefined()
    expect(fakeStorage.files.has(key)).toBe(false)
  })
})