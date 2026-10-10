//src/components/layout/public.config.ts
import { paths } from "@/config/paths"
import { legalLinks } from "@/config/site"

export type PublicLink = { label: string; to: string }

export const publicConfig = {
  nav: [
    { label: "Home", to: paths.home },
    { label: "Contact", to: paths.contact },
    {label: "Price", to:paths.price}
  ] satisfies PublicLink[],
  cta: {
    login: { label: "Log in", to: paths.login },
    register: { label: "Get started", to: paths.register },
  },
  footerColumns: [
    { title: "Company", links: [{ label: "Contact", to: paths.contact }] },
    { title: "Legal", links: legalLinks },
  ] satisfies { title: string; links: PublicLink[] }[],
}