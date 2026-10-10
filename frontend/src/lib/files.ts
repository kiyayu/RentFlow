//src/lib/files.ts
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export type FileRule = { types: string[]; maxBytes: number }

// Early feedback only. The server re-checks everything.
export function validateFile(file: File, rule: FileRule): string | null {
  if (!rule.types.includes(file.type)) return 'This file type is not allowed.'
  if (file.size > rule.maxBytes) return `File is too large. Maximum is ${formatBytes(rule.maxBytes)}.`
  return null
}