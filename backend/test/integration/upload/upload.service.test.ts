//test/integration/upload/upload.service.test.ts
import { vi } from 'vitest'
vi.hoisted(() => { process.env.STORAGE_DRIVER = 'fake' })
import { describe, it, expect, beforeEach } from 'vitest'
import { Types } from 'mongoose'
import { uploadService } from '../../../src/modules/upload/upload.service'
import { storage, fakeStorage } from '../../../src/modules/upload/storage'
const userId = new Types.ObjectId().toString()
const otherId = new Types.ObjectId().toString()
const png = { purpose: 'avatar' as const, contentType: 'image/png', size: 1000 }

describe('uploadService', () => {
  beforeEach(() => fakeStorage.files.clear())

  describe('sign', () => {
    it('uses the fake driver in tests', () => expect(storage).toBe(fakeStorage))
    it('returns a key owned by the user', () => {
      const r = uploadService.sign(userId, png)
      expect(r.fileKey).toMatch(new RegExp(`^avatar/${userId}/[0-9a-f]{32}$`))
    })
    it('rejects a disallowed type (svg)', () => {
      expect(() => uploadService.sign(userId, { ...png, contentType: 'image/svg+xml' })).toThrow(/not allowed/i)
    })
    it('rejects an oversized file', () => {
      expect(() => uploadService.sign(userId, { ...png, size: 3 * 1024 * 1024 })).toThrow(/too large/i)
    })
    it('never reuses a key', () => {
      expect(uploadService.sign(userId, png).fileKey).not.toBe(uploadService.sign(userId, png).fileKey)
    })
  })

  describe('confirm', () => {
    it('returns the url for a valid upload', async () => {
      const { fileKey } = uploadService.sign(userId, png)
      fakeStorage.simulateUpload(fileKey, { bytes: 1000, format: 'png', url: 'https://cdn/x.png' })
      const r = await uploadService.confirm(userId, { purpose: 'avatar', fileKey })
      expect(r.fileUrl).toBe('https://cdn/x.png')
    })
    it('fails if nothing was uploaded', async () => {
      const { fileKey } = uploadService.sign(userId, png)
      await expect(uploadService.confirm(userId, { purpose: 'avatar', fileKey })).rejects.toThrow(/upload not found/i)
    })
    it('deletes and rejects a file that is bigger than the rule', async () => {
      const { fileKey } = uploadService.sign(userId, png)
      fakeStorage.simulateUpload(fileKey, { bytes: 9 * 1024 * 1024, format: 'png', url: 'u' })
      await expect(uploadService.confirm(userId, { purpose: 'avatar', fileKey })).rejects.toThrow(/too large/i)
      expect(fakeStorage.files.has(fileKey)).toBe(false)
    })
    it('deletes and rejects a wrong format', async () => {
      const { fileKey } = uploadService.sign(userId, png)
      fakeStorage.simulateUpload(fileKey, { bytes: 10, format: 'gif', url: 'u' })
      await expect(uploadService.confirm(userId, { purpose: 'avatar', fileKey })).rejects.toThrow(/type not allowed/i)
      expect(fakeStorage.files.has(fileKey)).toBe(false)
    })
    it("cannot confirm another user's key", async () => {
      const { fileKey } = uploadService.sign(otherId, png)
      fakeStorage.simulateUpload(fileKey, { bytes: 10, format: 'png', url: 'u' })
      await expect(uploadService.confirm(userId, { purpose: 'avatar', fileKey })).rejects.toThrow(/not found/i)
    })
    it('cannot confirm under a different purpose', async () => {
      const { fileKey } = uploadService.sign(userId, png)
      fakeStorage.simulateUpload(fileKey, { bytes: 10, format: 'png', url: 'u' })
      await expect(uploadService.confirm(userId, { purpose: 'attachment', fileKey })).rejects.toThrow(/not found/i)
    })
  })

  describe('remove', () => {
    it('deletes own file', async () => {
      const { fileKey } = uploadService.sign(userId, png)
      fakeStorage.simulateUpload(fileKey, { bytes: 10, format: 'png', url: 'u' })
      await uploadService.remove(userId, fileKey)
      expect(fakeStorage.files.has(fileKey)).toBe(false)
    })
    it("cannot delete another user's file", async () => {
      const { fileKey } = uploadService.sign(otherId, png)
      fakeStorage.simulateUpload(fileKey, { bytes: 10, format: 'png', url: 'u' })
      await expect(uploadService.remove(userId, fileKey)).rejects.toThrow(/not found/i)
      expect(fakeStorage.files.has(fileKey)).toBe(true)
    })
  })
})