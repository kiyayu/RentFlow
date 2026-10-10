//src/features/preferences/components/ThemeSelector.tsx
import { Monitor, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePreferencesStore, type Theme } from "../preferences.store"

const options: { value: Theme; label: string; icon: React.ReactNode }[] = [
  { value: "light", label: "Light", icon: <Sun /> },
  { value: "dark", label: "Dark", icon: <Moon /> },
  { value: "system", label: "System", icon: <Monitor /> },
]

export function ThemeSelector() {
  const theme = usePreferencesStore((s) => s.theme)
  const setTheme = usePreferencesStore((s) => s.setTheme)

  return (
    <div role="group" aria-label="Theme" className="flex flex-wrap gap-2">
      {options.map(({ value, label, icon }) => (
        <Button
          key={value}
          variant={theme === value ? "default" : "outline"}
          aria-pressed={theme === value}
          onClick={() => setTheme(value)}
          icon={icon}
        >
          {label}
        </Button>
      ))}
    </div>
  )
}