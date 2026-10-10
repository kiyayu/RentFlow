//src/features/settings/SettingsSection.tsx
export function SettingsSection({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children?: React.ReactNode
}) {
  return (
    <section className="p-6 space-y-4 bg-card border border-border rounded-xl shadow-sm">
      <div className="space-y-1">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {children}
    </section>
  )
}