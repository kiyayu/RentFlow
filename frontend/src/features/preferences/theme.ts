//src/features/preferences/theme.ts
import { usePreferencesStore, type Theme } from "./preferences.store"

const query = () => window.matchMedia("(prefers-color-scheme: dark)")

const isDark = (theme: Theme) => (theme === "system" ? query().matches : theme === "dark")

const apply = (theme: Theme) =>
  document.documentElement.classList.toggle("dark", isDark(theme))

// Called once at startup. Keeps the <html> class in sync with the store and the OS setting.
export function startThemeSync() {
  apply(usePreferencesStore.getState().theme)
  usePreferencesStore.subscribe((state) => apply(state.theme))
  query().addEventListener("change", () => {
    if (usePreferencesStore.getState().theme === "system") apply("system")
  })
}