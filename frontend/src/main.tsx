//src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { registerSessionExpiry, registerBfcacheGuard } from '@/features/auth'
import { startThemeSync } from '@/features/preferences'
import '@/lib/i18n/locales/en/index.ts'
import './lib/i18n'
startThemeSync()
registerBfcacheGuard()
registerSessionExpiry()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)