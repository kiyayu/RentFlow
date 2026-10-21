//src/lib/i18n/locales/en/index.ts
import { common } from './common'
import { validation } from './validation'
import { errors } from './errors'
import { auth } from './auth'
import { layout } from './layout'
import { settings } from './settings'
import { notifications } from './notifications'
import { marketing } from './marketing'
import { legal } from './legal'
import { product } from './product'
import { dashboard } from './dashboard'
import { reservation } from './reservation'
import { inventory } from './inventory'

// A new namespace = one file here + one line below. Types follow automatically.
export const en = {
  common, validation, errors, auth, layout, settings, notifications, marketing, legal, product, dashboard, reservation, inventory,
} as const
