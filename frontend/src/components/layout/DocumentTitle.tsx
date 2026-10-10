// src/components/layout/DocumentTitle.tsx
import { useEffect } from "react"
import { useMatches } from "react-router-dom"
import { site } from "@/config/site"

export function DocumentTitle() {
  const matches = useMatches() as { handle?: { title?: string } }[]
  const title = [...matches].reverse().find((m) => m.handle?.title)?.handle?.title

  useEffect(() => {
    document.title = title ? `${title} · ${site.name}` : site.name
  }, [title])

  return null
}