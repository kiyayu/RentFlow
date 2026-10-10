//src/features/marketing/components/FeatureGrid.tsx
import { marketingConfig } from "../pages/marketing.config"

export function FeatureGrid() {
  const { featuresTitle, features } = marketingConfig
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold text-center text-foreground">{featuresTitle}</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ title, description, icon: Icon }) => (
          <div
            key={title}
            className="p-6 space-y-3 bg-card border border-border rounded-xl shadow-sm"
          >
            <div className="flex items-center justify-center size-10 text-primary bg-primary/10 rounded-lg">
              <Icon className="size-5" />
            </div>
            <h3 className="text-base font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}