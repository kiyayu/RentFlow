//src/modules/upload/storage/storage.interface.ts
export type SignedUpload = {
  provider: string
  uploadUrl: string
  method: 'POST'
  fields: Record<string, string | number>  // extra form fields the browser must send with the file
}

export type StoredFile = { bytes: number; format: string; url: string }

export interface StorageDriver {
  createUpload(input: { key: string; allowedFormats: string[] }): SignedUpload
  inspect(key: string): Promise<StoredFile | null>   // null = nothing was uploaded under this key
  delete(key: string): Promise<void>
}