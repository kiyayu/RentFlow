//src/lib/files.test.ts
import { describe, it, expect } from 'vitest'
import { formatBytes, validateFile } from './files'

const file = (type: string, size: number) => new File([new Uint8Array(size)], 'x', { type })
const rule = { types: ['image/png'], maxBytes: 1000 }

describe('files', () => {
  it('formats bytes', () => {
    expect(formatBytes(500)).toBe('500 B')
    expect(formatBytes(2048)).toBe('2.0 KB')
    expect(formatBytes(3 * 1024 * 1024)).toBe('3.0 MB')
  })
  it('accepts a valid file', () => expect(validateFile(file('image/png', 10), rule)).toBeNull())
  it('rejects a wrong type', () => expect(validateFile(file('image/svg+xml', 10), rule)).toMatch(/type/i))
  it('rejects a large file', () => expect(validateFile(file('image/png', 2000), rule)).toMatch(/too large/i))
})