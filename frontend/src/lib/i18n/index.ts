//src/lib/i18n/index.ts  (complete file)
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { env } from '../env'
import { en } from './locales/en/index'
import { am } from './locales/am/index'

export const languages = ['en', 'am'] as const
export type AppLanguage = (typeof languages)[number]

const resources = { en, am } as const
const languageStorageKey = 'language'

const isSupportedLanguage = (value: string | null): value is AppLanguage =>
  !!value && languages.includes(value as AppLanguage)

const initialLanguage = (): AppLanguage => {
  const saved = typeof window === 'undefined' ? null : window.localStorage.getItem(languageStorageKey)
  if (isSupportedLanguage(saved)) return saved
  return isSupportedLanguage(env.defaultLang) ? env.defaultLang : 'en'
}

const syncDocumentLanguage = (language: string) => {
  if (typeof window === 'undefined') return
  if (isSupportedLanguage(language)) window.localStorage.setItem(languageStorageKey, language)
  document.documentElement.lang = language
}

const language = initialLanguage()
syncDocumentLanguage(language)

// Exported so tests can wait until resources are really loaded.
export const i18nReady = i18n.use(initReactI18next).init({
  resources,
  lng: language,
  fallbackLng: 'en',
  defaultNS: 'common',
  ns: Object.keys(en),
  interpolation: { escapeValue: false }, // React already escapes output
})

i18n.on('languageChanged', syncDocumentLanguage)

export { i18n }
export { useTranslation, Trans } from 'react-i18next'
