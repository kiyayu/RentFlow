//src/modules/upload/upload.rules.ts
export const UPLOAD_PURPOSES = ['avatar', 'attachment'] as const
export type UploadPurpose = (typeof UPLOAD_PURPOSES)[number]

type UploadRule = {
  types: string[]    // MIME types the browser may declare
  formats: string[]  // formats storage reports back (Cloudinary says "jpg" for jpeg)
  maxBytes: number
}

// New kind of file in a future feature = one new row here.
export const UPLOAD_RULES: Record<UploadPurpose, UploadRule> = {
  avatar: {
    types: ['image/png', 'image/jpeg', 'image/webp'],   // never SVG: scripts can hide in it
    formats: ['png', 'jpg', 'jpeg', 'webp'],
    maxBytes: 2 * 1024 * 1024,
  },
  attachment: {
    types: ['image/png', 'image/jpeg', 'image/webp', 'application/pdf'],
    formats: ['png', 'jpg', 'jpeg', 'webp', 'pdf'],
    maxBytes: 10 * 1024 * 1024,
  },
}

export const FILE_KEY_PATTERN = /^[a-z]+\/[0-9a-f]{24}\/[0-9a-f]{32}$/