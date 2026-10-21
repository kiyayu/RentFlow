import { Languages } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { i18n, useTranslation } from '@/lib/i18n'

export function PublicLanguageSelector() {
  useTranslation()
  const amharic = i18n.resolvedLanguage === 'am'
  return <Button type="button" size="sm" variant="ghost" aria-label="Change language" icon={<Languages />} onClick={() => { void i18n.changeLanguage(amharic ? 'en' : 'am') }}>{amharic ? 'EN' : 'አማ'}</Button>
}
