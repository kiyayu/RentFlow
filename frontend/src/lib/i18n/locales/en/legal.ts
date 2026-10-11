//src/lib/i18n/locales/en/legal.ts
const PLACEHOLDER = 'Replace this text with reviewed legal wording before launch.'

// Wording must come from a lawyer or a reputable generator for your jurisdiction.
export const legal = {
  lastUpdated: 'Last updated: {{date}}',
  terms: {
    title: 'Terms of Service',
    sections: [
      { heading: '1. Acceptance of the terms', body: [PLACEHOLDER] },
      { heading: '2. Your account', body: [PLACEHOLDER] },
      { heading: '3. Acceptable use', body: [PLACEHOLDER] },
      { heading: '4. Content and ownership', body: [PLACEHOLDER] },
      { heading: '5. Termination', body: [PLACEHOLDER] },
      { heading: '6. Liability and disclaimers', body: [PLACEHOLDER] },
      { heading: '7. Changes to these terms', body: [PLACEHOLDER] },
      { heading: '8. Contact', body: [PLACEHOLDER] },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    sections: [
      { heading: '1. What we collect', body: [PLACEHOLDER] },
      { heading: '2. How we use it', body: [PLACEHOLDER] },
      { heading: '3. Cookies and sessions', body: [PLACEHOLDER] },
      { heading: '4. Sharing and processors', body: [PLACEHOLDER] },
      { heading: '5. Retention', body: [PLACEHOLDER] },
      { heading: '6. Your rights (access, export, deletion)', body: [PLACEHOLDER] },
      { heading: '7. Security', body: [PLACEHOLDER] },
      { heading: '8. Contact', body: [PLACEHOLDER] },
    ],
  },
} as const