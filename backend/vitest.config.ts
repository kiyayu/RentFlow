// vitest.config.ts
import { defineConfig } from 'vitest/config'
 
export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
    testTimeout: 15000,
    hookTimeout: 30000,  
    fileParallelism: false,
    setupFiles: ['./test/helpers/loadTestEnv.ts',  './test/setup.ts',],
  },
})