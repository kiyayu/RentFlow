//src/features/uploads/api/upload.api.ts
import axios from 'axios'
import { api } from '@/lib/axios'

export type SignedUpload = {
  provider: string
  uploadUrl: string
  method: 'POST'
  fields: Record<string, string | number>
  fileKey: string
  maxBytes: number
}

export type UploadPurpose = 'avatar' | 'attachment'

export const uploadApi = {
  sign: async (input: { purpose: UploadPurpose; contentType: string; size: number }): Promise<SignedUpload> => {
    const res = await api.post<{ data: SignedUpload }>('/uploads/sign', input)
    return res.data.data
  },

  // Plain axios on purpose: this goes to the storage provider, so no cookies and no refresh interceptor.
  sendToStorage: async (
    signed: SignedUpload,
    file: File,
    onProgress?: (percent: number) => void
  ): Promise<void> => {
    const form = new FormData()
    Object.entries(signed.fields).forEach(([k, v]) => form.append(k, String(v)))
    form.append('file', file) // the file must come last
    await axios.post(signed.uploadUrl, form, {
      withCredentials: false,
      onUploadProgress: (e) => e.total && onProgress?.(Math.round((e.loaded / e.total) * 100)),
    })
  },
}