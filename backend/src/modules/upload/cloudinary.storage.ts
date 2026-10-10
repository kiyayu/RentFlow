//src/modules/upload/storage/cloudinary.storage.ts
import { v2 as cloudinary } from 'cloudinary'
import { env } from '../../config/env.js'
import type { SignedUpload, StorageDriver, StoredFile } from './storage.interface.js'

const notFound = (err: any) => (err?.http_code ?? err?.error?.http_code) === 404

export class CloudinaryStorage implements StorageDriver {
  constructor() {
    cloudinary.config({
      cloud_name: env.cloudinaryCloudName,
      api_key: env.cloudinaryApiKey,
      api_secret: env.cloudinaryApiSecret,
      secure: true,
    })
  }

  createUpload({ key, allowedFormats }: { key: string; allowedFormats: string[] }): SignedUpload {
    const timestamp = Math.floor(Date.now() / 1000)
    // Everything in this object is covered by the signature. The browser must send
    // exactly these values, or Cloudinary rejects the upload.
    const signed = { public_id: key, timestamp, allowed_formats: allowedFormats.join(',') }
    const signature = cloudinary.utils.api_sign_request(signed, env.cloudinaryApiSecret!)

    return {
      provider: 'cloudinary',
      uploadUrl: `https://api.cloudinary.com/v1_1/${env.cloudinaryCloudName}/image/upload`,
      method: 'POST',
      fields: { ...signed, api_key: env.cloudinaryApiKey!, signature },
    }
  }

  async inspect(key: string): Promise<StoredFile | null> {
    try {
      const r = await cloudinary.api.resource(key, { resource_type: 'image' })
      return { bytes: r.bytes, format: r.format, url: r.secure_url }
    } catch (err) {
      if (notFound(err)) return null
      throw err
    }
  }

  async delete(key: string): Promise<void> {
    await cloudinary.uploader.destroy(key, { resource_type: 'image', invalidate: true })
  }
}
