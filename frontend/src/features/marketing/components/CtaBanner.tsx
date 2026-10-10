//src/features/marketing/components/CtaBanner.tsx
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { paths } from "@/config/paths"
import { marketingConfig } from "../pages/marketing.config"

export function CtaBanner() {
  const { title, description } = marketingConfig.cta
  return (
    <section className="p-8 space-y-4 text-center bg-card border border-border rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
      <Button asChild>
        <Link to={paths.register}>Create account</Link>
      </Button>
    </section>
  )
}