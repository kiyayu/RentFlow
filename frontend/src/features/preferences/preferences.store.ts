//src/features/preferences/preferences.store.ts
import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Theme = "light" | "dark" | "system"
export const PREFERENCES_KEY = "preferences"

type PreferencesStore = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set) => ({
      theme: "system",
      setTheme: (theme) => set({ theme }),
    }),
    { name: PREFERENCES_KEY }
  )
)