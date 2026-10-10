//src/features/marketing/marketing.config.ts
import { Zap, ShieldCheck, Layers, type LucideIcon } from "lucide-react"

export type Feature = { title: string; description: string; icon: LucideIcon }

export const marketingConfig = {
  hero: {
    title: "One clear headline that says what you do",
    description:
      "One or two sentences that explain the value to a first-time visitor. Replace per project.",
  },
  featuresTitle: "Why people use it",
  features: [
    { title: "Fast", description: "Describe the first benefit in one sentence.", icon: Zap },
    { title: "Secure", description: "Describe the second benefit in one sentence.", icon: ShieldCheck },
    { title: "Organized", description: "Describe the third benefit in one sentence.", icon: Layers },
  ] satisfies Feature[],
  cta: {
    title: "Ready to start?",
    description: "Create an account in under a minute.",
  },
}