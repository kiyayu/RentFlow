//src/components/layout/DocumentTitle.tsx
import { useEffect } from 'react'
import { useMatches } from 'react-router-dom'
import { site } from '@/config/site'
import { useTranslation } from '@/lib/i18n'

export function DocumentTitle() {
  const { t } = useTranslation('layout')
  const matches = useMatches() as { handle?: { title?: string; titleKey?: string } }[]
  const handle = [...matches].reverse().find((m) => m.handle?.title || m.handle?.titleKey)?.handle

  useEffect(() => {
    const title = handle?.titleKey ? t(handle.titleKey as never) : handle?.title
    document.title = title ? `${title} · ${site.name}` : site.name
  }, [handle?.title, handle?.titleKey, t])

  return null
}
