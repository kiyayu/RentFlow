//src/lib/i18n/translate.ts

// Zod messages are keys like 'validation:emailRequired'. They carry their own namespace,
// so this helper accepts a t function from ANY namespace.
// The one unavoidable cast lives here instead of in every form.
type AnyT = (key: never) => string

export const translateMessage = (t: AnyT, message?: string): string | undefined =>
  message ? t(message as never) : undefined