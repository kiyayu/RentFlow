import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center shrink-0 text-sm font-medium whitespace-nowrap select-none bg-clip-padding border border-transparent rounded-lg transition-all group/button cursor-pointer outline-none focus-visible:outline-none focus-visible:ring-2 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "text-primary-foreground bg-primary hover:bg-primary/90 focus-visible:ring-ring",
        secondary: "text-secondary-foreground bg-secondary hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] focus-visible:ring-ring",
        outline: "bg-card border-border hover:bg-muted hover:text-foreground focus-visible:ring-ring",
        ghost: "hover:bg-muted hover:text-foreground focus-visible:ring-ring",
        link: "text-primary underline-offset-4 hover:underline",
        destructive: "text-destructive-foreground bg-destructive hover:bg-destructive/90 focus-visible:ring-destructive",
        success: "text-success-foreground bg-success hover:bg-success/90 focus-visible:ring-success",
        info: "text-info-foreground bg-info hover:bg-info/90 focus-visible:ring-info",
        warning: "text-warning-foreground bg-warning hover:bg-warning/90 focus-visible:ring-warning",
      },
      size: {
        default: "gap-1.5 h-11 px-4 has-[[data-icon=inline-start]]:pl-3.5 has-[[data-icon=inline-end]]:pr-3.5",

        lg: "gap-2 h-12 px-6 text-base has-[[data-icon=inline-start]]:pl-4.5 has-[[data-icon=inline-end]]:pr-4.5",
        icon: "size-11",
        sm: "gap-1 h-9 px-3 text-xs has-[[data-icon=inline-start]]:pl-2.5 has-[[data-icon=inline-end]]:pr-2.5",
"icon-sm": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  icon?: React.ReactNode
  iconPosition?: "start" | "end"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, icon, iconPosition = "start", children, ...props }, ref) => {
    if (asChild) {
      return (
        <Slot
          ref={ref}
          data-slot="button"
          data-variant={variant}
          data-size={size}
          className={cn(buttonVariants({ variant, size, className }))}
          {...props}
        >
          {children}
        </Slot>
      )
    }

    return (
      <button
        ref={ref}
        data-slot="button"
        data-variant={variant}
        data-size={size}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {icon && iconPosition === "start" && (
          <span data-icon="inline-start" className="flex items-center justify-center">
            {icon}
          </span>
        )}

        {children && <span>{children}</span>}

        {icon && iconPosition === "end" && (
          <span data-icon="inline-end" className="flex items-center justify-center">
            {icon}
          </span>
        )}
      </button>
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }