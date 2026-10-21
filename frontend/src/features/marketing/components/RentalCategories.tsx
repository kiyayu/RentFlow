import { Camera, Laptop, Presentation } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

const icons = [Camera, Laptop, Presentation]
type Category = { title: string; description: string }

export function RentalCategories() {
  const { t } = useTranslation('marketing')
  const categories = t('categories.items', { returnObjects: true }) as unknown as Category[]
  return <section className="space-y-6"><div className="max-w-2xl space-y-2"><p className="text-sm font-medium text-primary">{t('categories.eyebrow')}</p><h2 className="text-2xl font-semibold text-foreground">{t('categories.title')}</h2><p className="text-muted-foreground">{t('categories.description')}</p></div><div className="grid gap-4 md:grid-cols-3">{categories.map((category, index) => { const Icon = icons[index]; return <article key={category.title} className="space-y-3 rounded-xl border border-border bg-card p-6"><Icon className="size-5 text-primary"/><h3 className="font-semibold text-foreground">{category.title}</h3><p className="text-sm leading-6 text-muted-foreground">{category.description}</p></article> })}</div></section>
}
