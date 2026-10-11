//src/lib/i18n/locales/en/index.ts
import { common } from './common'
import { validation } from './validation'
import { errors } from './errors'
import { auth } from './auth'
import { layout } from './layout'

// A new namespace = one file here + one line below. Types follow automatically.
export const en = { common, validation, errors, auth, layout } as const