//src/features/preferences/components/ThemeSelector.tsx
import { Monitor, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n'
import { usePreferencesStore, type Theme } from '../preferences.store'

const options: { value: Theme; icon: React.ReactNode }[] = [
  { value: 'light', icon: <Sun /> },
  { value: 'dark', icon: <Moon /> },
  { value: 'system', icon: <Monitor /> },
]

export function ThemeSelector() {
  const { t } = useTranslation('settings')
  const theme = usePreferencesStore((s) => s.theme)
  const setTheme = usePreferencesStore((s) => s.setTheme)

  return (
    <div role="group" aria-label={t('preferences.theme')} className="flex flex-wrap gap-2">
      {options.map(({ value, icon }) => (
        <Button
          key={value}
          variant={theme === value ? 'default' : 'outline'}
          aria-pressed={theme === value}
          onClick={() => setTheme(value)}
          icon={icon}
        >
          {t(`preferences.${value}`)}
        </Button>
      ))}
    </div>
  )
}