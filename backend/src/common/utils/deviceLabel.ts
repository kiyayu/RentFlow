// src/common/utils/deviceLabel.ts
import { UAParser } from 'ua-parser-js'

export const parseDeviceLabel = (userAgent: string | undefined): string => {
  if (!userAgent) return 'Unknown device'

  const { browser, os, device } = new UAParser(userAgent).getResult()

  const browserName = browser.name ?? 'Unknown browser'
  
  const platform = device.model ?? os.name ?? 'Unknown platform'

  return `${browserName} on ${platform}`
}