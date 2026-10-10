//src/features/marketing/components/Hero.tsx
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { paths } from "@/config/paths"
import { marketingConfig } from "../pages/marketing.config"

export function Hero() {
  const { title, description } = marketingConfig.hero
  return (
    <section className="py-12 space-y-6 text-center md:py-20">
      <h1 className="max-w-3xl mx-auto text-3xl font-semibold text-foreground md:text-5xl">
        {title}
      </h1>
      <p className="max-w-2xl mx-auto text-base text-muted-foreground">{description}</p>
      <div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
        <Button asChild size="lg">
          <Link to={paths.register}>Get started</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link to={paths.login}>Log in</Link>
        </Button>
      </div>
    </section>
  )
}