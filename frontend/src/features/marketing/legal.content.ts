//src/features/marketing/legal.content.ts
export type LegalSection = { heading: string; body: string[] }

const PLACEHOLDER = "Replace this text with reviewed legal wording before launch."

export const termsSections: LegalSection[] = [
  { heading: "1. Acceptance of the terms", body: [PLACEHOLDER] },
  { heading: "2. Your account", body: [PLACEHOLDER] },
  { heading: "3. Acceptable use", body: [PLACEHOLDER] },
  { heading: "4. Content and ownership", body: [PLACEHOLDER] },
  { heading: "5. Termination", body: [PLACEHOLDER] },
  { heading: "6. Liability and disclaimers", body: [PLACEHOLDER] },
  { heading: "7. Changes to these terms", body: [PLACEHOLDER] },
  { heading: "8. Contact", body: [PLACEHOLDER] },
]

export const privacySections: LegalSection[] = [
  { heading: "1. What we collect", body: [PLACEHOLDER] },
  { heading: "2. How we use it", body: [PLACEHOLDER] },
  { heading: "3. Cookies and sessions", body: [PLACEHOLDER] },
  { heading: "4. Sharing and processors", body: [PLACEHOLDER] },
  { heading: "5. Retention", body: [PLACEHOLDER] },
  { heading: "6. Your rights (access, export, deletion)", body: [PLACEHOLDER] },
  { heading: "7. Security", body: [PLACEHOLDER] },
  { heading: "8. Contact", body: [PLACEHOLDER] },
]