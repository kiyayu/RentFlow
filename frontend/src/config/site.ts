//src/config/site.ts
import type { ParseKeys } from "i18next";
import { paths } from "./paths";

export const site = {
  name: "RentFlow",
  supportEmail: "support@example.com",
  legalUpdated: "2026-01-01",
};

export const legalLinks: { labelKey: ParseKeys<"layout">; to: string }[] = [
  { labelKey: "legal.terms", to: paths.terms },
  { labelKey: "legal.privacy", to: paths.privacy },
];
