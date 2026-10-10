//src/test/setup.ts
import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// lib/env.ts validates at import time, so tests must supply it.
vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:5000/api/')