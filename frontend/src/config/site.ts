//src/config/site.ts
import { paths } from "./paths"

export const site = {
  name: "BrandName",
  tagline: "A short line about what the product does.",
  copyright: `© ${new Date().getFullYear()} BrandName`,
  supportEmail: "support@example.com", // replace per project
  legalUpdated: "2026-01-01",          // replace when the legal text changes
}

export const legalLinks = [
  { label: "Terms of Service", to: paths.terms },
  { label: "Privacy Policy", to: paths.privacy },
]