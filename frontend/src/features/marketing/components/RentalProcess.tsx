import { CalendarDays, ClipboardCheck, RotateCcw } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

const icons = [CalendarDays, ClipboardCheck, RotateCcw]

type Step = { title: string; description: string }

export function RentalProcess() {
  const { t } = useTranslation('marketing')
  const steps = t('process.steps', { returnObjects: true }) as unknown as Step[]

  return <section className="space-y-6 rounded-2xl border border-border bg-card p-6 md:p-8"><div className="max-w-2xl space-y-2"><p className="text-sm font-medium text-primary">{t('process.eyebrow')}</p><h2 className="text-2xl font-semibold text-foreground">{t('process.title')}</h2></div><ol className="grid gap-6 md:grid-cols-3">{steps.map((step, index) => { const Icon = icons[index]; return <li key={step.title} className="space-y-3"><div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="size-5" /></div><h3 className="font-semibold text-foreground">{step.title}</h3><p className="text-sm leading-6 text-muted-foreground">{step.description}</p></li> })}</ol></section>
}
