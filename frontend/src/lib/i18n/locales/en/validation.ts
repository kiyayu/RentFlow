//src/lib/i18n/locales/en/validation.ts
// Zod schemas store keys like 'validation:emailRequired'. The form translates them for display.
export const validation = {
  emailRequired: 'Email is required',
  emailInvalid: 'Enter a valid email',
  passwordRequired: 'Password is required',
  passwordMin: 'Use at least 8 characters',
  passwordMax: 'Use at most 72 characters',
  passwordUppercase: 'Include at least one uppercase letter',
  passwordNumber: 'Include at least one number',
  nameMin: 'Name must be at least 3 characters',
  otpFormat: 'Enter the 6-digit code',
  confirmRequired: 'Confirm your password',
  passwordsMismatch: 'Passwords do not match',
} as const