//src/lib/i18n/locales/en/marketing.ts
export const marketing = {
  tagline: 'A short line about what the product does.',
  hero: {
    title: 'One clear headline that says what you do',
    description:
      'One or two sentences that explain the value to a first-time visitor. Replace per project.',
    primary: 'Get started',
    secondary: 'Log in',
  },
  features: {
    title: 'Why people use it',
    items: [
      { title: 'Fast', description: 'Describe the first benefit in one sentence.', icon: 'zap' },
      { title: 'Secure', description: 'Describe the second benefit in one sentence.', icon: 'shield' },
      { title: 'Organized', description: 'Describe the third benefit in one sentence.', icon: 'layers' },
    ],
  },
  cta: {
    title: 'Ready to start?',
    description: 'Create an account in under a minute.',
    button: 'Create account',
  },
  contact: {
    title: 'Contact',
    description: 'Questions, feedback or support requests.',
    body: 'Email us and we will reply as soon as we can.',
  },
} as const