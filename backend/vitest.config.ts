// vitest.config.ts
import { defineConfig } from 'vitest/config'
// vitest.config.ts
export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
    testTimeout: 15000,
    hookTimeout: 30000,  
    setupFiles: ['./test/helpers/loadTestEnv.ts'],
  },
})