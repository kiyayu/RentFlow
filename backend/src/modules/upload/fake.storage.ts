//src/modules/upload/storage/fake.storage.ts
import type { SignedUpload, StorageDriver, StoredFile } from './storage.interface.js'

// Tests only. Nothing leaves the process.
export class FakeStorage implements StorageDriver {
  files = new Map<string, StoredFile>()

  createUpload({ key }: { key: string; allowedFormats: string[] }): SignedUpload {
    return { provider: 'fake', uploadUrl: `http://fake.local/upload/${key}`, method: 'POST', fields: { key } }
  }
  async inspect(key: string) { return this.files.get(key) ?? null }
  async delete(key: string) { this.files.delete(key) }

  // test helper: pretend the browser uploaded this
  simulateUpload(key: string, file: StoredFile) { this.files.set(key, file) }
}