//src/lib/i18n/locales/en/errors.ts
export const errors = {
  generic: 'Something went wrong. Please try again.',
  network: 'Cannot reach the server. Check your connection.',
  page: {
    notFoundLabel: '404',
    notFoundTitle: 'Page not found',
    notFoundDescription: 'The page you are looking for does not exist or was moved.',
    genericLabel: 'Error',
    genericTitle: 'Something went wrong',
    genericDescription: 'An unexpected error occurred. You can try again or go back home.',
  },
  panel: {
    notFoundDescription: 'This page does not exist inside the app.',
    genericDescription: 'An unexpected error occurred. Try again or go back to the dashboard.',
  },
} as const