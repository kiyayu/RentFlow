// test/unit/auth/deviceLabel.test.ts
import { describe, it, expect } from 'vitest'
import { parseDeviceLabel } from '../../../src/common/utils/deviceLabel.js'

describe('parseDeviceLabel', () => {
  it('returns "Unknown device" when no user-agent is provided', () => {
    expect(parseDeviceLabel(undefined)).toBe('Unknown device')
  })

  it('parses a real Chrome-on-Windows user-agent string', () => {
    const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
    const label = parseDeviceLabel(ua)
    expect(label).toContain('Chrome')
  })

  it('parses a real Safari-on-iPhone user-agent string', () => {
    const ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'
    const label = parseDeviceLabel(ua)
    expect(label).toContain('Safari')
  })

  it('never returns "undefined on undefined" even for a garbage string', () => {
    const label = parseDeviceLabel('not-a-real-user-agent-at-all')
    expect(label).not.toContain('undefined')
  })
})