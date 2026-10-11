//src/test/setup.ts  (complete file)
import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// lib/env.ts validates at import time, so these must run BEFORE importing i18n.
vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:5000/api/')
vi.stubEnv('VITE_DEFAULT_LANG', 'en')

const { i18nReady } = await import('@/lib/i18n')
await i18nReady