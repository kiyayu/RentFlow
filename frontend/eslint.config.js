// eslint.config.js
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

// Rule: a file matches exactly ONE no-restricted-imports block,
// because ESLint replaces a rule by name when blocks overlap.

const noFeatureInternals = {
  group: ['@/features/*/*'],
  message: 'Import from the feature public API (@/features/<name>), not its internals.',
}

export default defineConfig([
  globalIgnores(['dist', 'coverage']),

  // Base setup
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },

  // shadcn files export a component and a variants helper together. Dev-only rule, safe to disable.
  {
    files: ['src/components/ui/**/*.{ts,tsx}'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },

  // R6a: shared layers never import features or app.
  {
    files: [
      'src/components/**/*.{ts,tsx}',
      'src/lib/**/*.{ts,tsx}',
      'src/config/**/*.{ts,tsx}',
      'src/store/**/*.{ts,tsx}',
    ],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          {
            group: ['@/features/*', '@/app/*'],
            message: 'Shared code must not import features or app.',
          },
        ],
      }],
    },
  },

  // R6c + R6d: auth is the base domain. It cannot import anything built on top of it,
  // and it cannot import app.
  {
    files: ['src/features/auth/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          {
            group: [
              '@/features/user*',
              '@/features/settings*',
              '@/features/notifications*',
              '@/features/preferences*',
            ],
            message: 'auth must not import features built on top of it.',
          },
          { group: ['@/app/*'], message: 'Features must not import app.' },
          noFeatureInternals,
        ],
      }],
    },
  },

  // R6b + R6d: every other feature. No app imports, no deep imports into other features.
  {
    files: ['src/features/**/*.{ts,tsx}'],
    ignores: ['src/features/auth/**'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          { group: ['@/app/*'], message: 'Features must not import app.' },
          noFeatureInternals,
        ],
      }],
    },
  },

  // R6d for the app layer, except the router, which lazy-loads page files on purpose.
  {
    files: ['src/app/**/*.{ts,tsx}'],
    ignores: ['src/app/router/**'],
    rules: {
      'no-restricted-imports': ['error', { patterns: [noFeatureInternals] }],
    },
  },
])
