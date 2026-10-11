//src/features/marketing/components/FeatureGrid.tsx
import { Layers, ShieldCheck, Zap, type LucideIcon } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

// Locale files hold an icon NAME; this map is the only place icons are chosen.
const icons: Record<string, LucideIcon> = { zap: Zap, shield: ShieldCheck, layers: Layers }

type Item = { title: string; description: string; icon: string }

export function FeatureGrid() {
  const { t } = useTranslation('marketing')
  const items = t('features.items', { returnObjects: true }) as unknown as Item[]

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold text-center text-foreground">{t('features.title')}</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ title, description, icon }) => {
          const Icon = icons[icon] ?? Zap
          return (
            <div key={title} className="p-6 space-y-3 bg-card border border-border rounded-xl shadow-sm">
              <div className="flex items-center justify-center size-10 text-primary bg-primary/10 rounded-lg">
                <Icon className="size-5" />
              </div>
              <h3 className="text-base font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}