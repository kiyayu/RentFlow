//src/config/site.ts
import type { ParseKeys } from 'i18next'
import { paths } from './paths'

// Brand facts. Wording (tagline, copy) moves to locale files in the marketing step.
export const site = {
  name: 'BrandName',
  tagline: 'A short line about what the product does.',
  supportEmail: 'support@example.com', // replace per project
  legalUpdated: '2026-01-01', // replace when the legal text changes
}

export const legalLinks: { labelKey: ParseKeys<'layout'>; to: string }[] = [
  { labelKey: 'legal.terms', to: paths.terms },
  { labelKey: 'legal.privacy', to: paths.privacy },
]