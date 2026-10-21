import { Languages } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { i18n, useTranslation, type AppLanguage } from '@/lib/i18n'

const options: AppLanguage[] = ['en', 'am']

export function LanguageSelector() {
  const { t } = useTranslation('settings')
  const currentLanguage = i18n.resolvedLanguage === 'am' ? 'am' : 'en'

  return (
    <div role="group" aria-label={t('preferences.language')} className="flex flex-wrap gap-2">
      {options.map((language) => (
        <Button
          key={language}
          variant={currentLanguage === language ? 'default' : 'outline'}
          aria-pressed={currentLanguage === language}
          onClick={() => { void i18n.changeLanguage(language) }}
          icon={<Languages />}
        >
          {t(`preferences.${language === 'en' ? 'english' : 'amharic'}`)}
        </Button>
      ))}
    </div>
  )
}
