// src/App.tsx
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/query.client'
 import { AppRouter } from './app/router/Index'
 import { Toaster } from './components/ui/sonner'
import {  usePreferencesStore } from './features/preferences/preferences.store'


export default function App() {
const theme = usePreferencesStore((s) => s.theme)
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
   <Toaster theme={theme} position="bottom-right" richColors closeButton />  
    </QueryClientProvider>
  )
}