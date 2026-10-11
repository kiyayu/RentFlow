//src/lib/i18n/index.ts  (complete file)
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { env } from '../env'
import { en } from './locales/en/index'

// Adding a language: create locales/<code>/ with the same shape, then add one line here.
const resources = { en } as const

// Exported so tests can wait until resources are really loaded.
export const i18nReady = i18n.use(initReactI18next).init({
  resources,
  lng: env.defaultLang in resources ? env.defaultLang : 'en',
  fallbackLng: 'en',
  defaultNS: 'common',
  ns: Object.keys(en),
  interpolation: { escapeValue: false }, // React already escapes output
})

export { i18n }
export { useTranslation, Trans } from 'react-i18next'