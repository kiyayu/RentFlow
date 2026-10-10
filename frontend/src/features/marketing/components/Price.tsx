
import { Check, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"

type Plan = {
  name: string
  description: string
  price: string
  period: string
  action: string
  featured?: boolean
  features: {
    label: string
    included: boolean
  }[]
}

const plans: Plan[] = [
  {
    name: "Starter",
    description: "Essential tools for individuals getting started.",
    price: "$0",
    period: "forever",
    action: "Get started",
    features: [
      { label: "Up to 3 team members", included: true },
      { label: "100 products", included: true },
      { label: "Basic analytics", included: true },
      { label: "Email support", included: true },
      { label: "Advanced reports", included: false },
      { label: "Team permissions", included: false },
    ],
  },
  {
    name: "Pro",
    description: "Advanced tools for growing businesses and teams.",
    price: "$19",
    period: "per user / month",
    action: "Start with Pro",
    featured: true,
    features: [
      { label: "Up to 10 team members", included: true },
      { label: "Unlimited products", included: true },
      { label: "Advanced analytics", included: true },
      { label: "Priority email support", included: true },
      { label: "Advanced reports", included: true },
      { label: "Team permissions", included: false },
    ],
  },
  {
    name: "Business",
    description:
      "Comprehensive controls, reporting, and collaboration for established teams.",
    price: "$49",
    period: "per user / month",
    action: "Choose Business",
    features: [
      { label: "Unlimited team members", included: true },
      { label: "Unlimited products", included: true },
      { label: "Advanced analytics", included: true },
      { label: "Priority support", included: true },
      { label: "Advanced reports", included: true },
      { label: "Team permissions", included: true },
    ],
  },
]

export function Price() {
  return (
    <section className="space-y-8">
      {/* Introduction */}
      <div className="mx-auto max-w-2xl space-y-3 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Simple, transparent pricing
        </h2>
        <p className="text-sm leading-6 text-muted-foreground sm:text-base">
          Choose the plan that fits your needs. Start free and upgrade
          as your business grows.
        </p>
      </div>

      {/* Pricing cards */}
      <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-3">
        {plans.map((plan) => (
          <article
            key={plan.name}
            className={`relative flex h-full flex-col gap-6 rounded-xl border bg-card p-6 text-card-foreground ${
              plan.featured
                ? "border-primary shadow-md"
                : "border-border shadow-sm"
            }`}
          >
            {/* Plan information */}
            <div className="space-y-3">
              <div className="flex min-h-7 items-center justify-between gap-2">
                <h3 className="text-lg font-semibold text-foreground">
                  {plan.name}
                </h3>

                {plan.featured && (
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                    Popular
                  </span>
                )}
              </div>

              <p className="min-h-12 text-sm leading-6 text-muted-foreground">
                {plan.description}
              </p>
            </div>

            {/* Price */}
            <div className="space-y-1">
              <p className="text-3xl font-semibold tracking-tight text-foreground">
                {plan.price}
              </p>
              <p className="text-sm text-muted-foreground">
                {plan.period}
              </p>
            </div>

            {/* Action */}
            <Button
              type="button"
              variant={plan.featured ? "default" : "outline"}
              className="w-full"
            >
              {plan.action}
            </Button>

            {/* Features */}
            <div className="mt-auto space-y-4">
              <h4 className="text-sm font-medium text-foreground">
                What's included
              </h4>

              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature.label}
                    className="flex items-start gap-2"
                  >
                    {feature.included ? (
                      <Check
                        aria-hidden="true"
                        className="mt-0.5 size-4 shrink-0 text-success"
                      />
                    ) : (
                      <Minus
                        aria-hidden="true"
                        className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                      />
                    )}

                    <span
                      className={`text-sm leading-5 ${
                        feature.included
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {feature.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>

      {/* Supporting information */}
      <p className="text-center text-sm text-muted-foreground">
        Need a custom solution? Contact our team to discuss your needs.
      </p>
    </section>
  )
}