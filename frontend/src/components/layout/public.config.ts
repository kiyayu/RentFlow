//src/components/layout/public.config.ts
import type { ParseKeys } from 'i18next'
import { paths } from '@/config/paths'
import { legalLinks } from '@/config/site'

type Key = ParseKeys<'layout'>
export type PublicLink = { labelKey: Key; to: string }

export const publicConfig = {
  nav: [
    { labelKey: 'nav.home', to: paths.home },
    { labelKey: 'nav.contact', to: paths.contact },
  ] satisfies PublicLink[],
  cta: {
    login: { labelKey: 'marketing.logIn' as Key, to: paths.login },
    register: { labelKey: 'marketing.getStarted' as Key, to: paths.register },
  },
  footerColumns: [
    { titleKey: 'footer.company' as Key, links: [{ labelKey: 'nav.contact' as Key, to: paths.contact }] },
    { titleKey: 'footer.legal' as Key, links: legalLinks },
  ],
}