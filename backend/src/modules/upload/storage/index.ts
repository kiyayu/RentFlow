//src/modules/upload/storage/index.ts
import { env } from '../../../config/env.js'
import { CloudinaryStorage } from '../cloudinary.storage.js'
import { FakeStorage } from '../fake.storage.js'
 

export const fakeStorage = new FakeStorage()

// Adding S3/R2 later = one new case here plus one new file.
export const storage = env.storageDriver === 'cloudinary' ? new CloudinaryStorage() : fakeStorage