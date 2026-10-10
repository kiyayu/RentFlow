//src/components/layout/PageContainer.tsx
import { cn } from "@/lib/utils"

const widths = {
  narrow: "max-w-2xl",
  standard: "max-w-5xl",
  wide: "max-w-7xl",
} as const

export function PageContainer({
  width = "standard",
  className,
  children,
}: {
  width?: keyof typeof widths
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn("w-full mx-auto p-4 space-y-6 md:p-6", widths[width], className)}>
      {children}
    </div>
  )
}