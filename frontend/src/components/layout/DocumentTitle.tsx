//src/components/layout/DocumentTitle.tsx
import { useEffect } from 'react'
import { useMatches } from 'react-router-dom'
import { site } from '@/config/site'
import { useTranslation } from '@/lib/i18n'

export function DocumentTitle() {
  const { t } = useTranslation('layout')
  const matches = useMatches() as { handle?: { titleKey?: string } }[]
  const key = [...matches].reverse().find((m) => m.handle?.titleKey)?.handle?.titleKey

  useEffect(() => {
    document.title = key ? `${t(key as never)} · ${site.name}` : site.name
  }, [key, t])

  return null
}