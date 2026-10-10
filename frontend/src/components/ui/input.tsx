import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Eye, EyeOff } from "lucide-react"

const inputVariants = cva(
  "flex w-full text-base file:text-sm file:font-medium placeholder:text-muted-foreground file:bg-transparent border file:border-0 rounded-lg shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  {
    variants: {
      variant: {
        default: "text-foreground bg-card border-input focus-visible:border-ring focus-visible:ring-ring",
        filled: "bg-secondary border-transparent focus-visible:bg-card focus-visible:ring-ring",
        outline: "bg-transparent border-2 border-primary focus-visible:ring-primary/30",
        ghost: "bg-transparent border-transparent shadow-none focus-visible:bg-accent focus-visible:ring-ring",
        success: "text-foreground bg-card border-success focus-visible:ring-success",
        info: "text-foreground bg-card border-info focus-visible:ring-info",
        warning: "text-foreground bg-card border-warning focus-visible:ring-warning",
        destructive: "text-destructive bg-card placeholder:text-destructive/50 border-destructive focus-visible:ring-destructive",
      },
      inputSize: {
        sm: "h-8 px-2 py-1",
        default: "h-11 px-4 py-2",
        lg: "h-14 px-6 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  label?: string
  icon?: React.ReactNode
  error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, inputSize, label, icon, type = "text", error, id, ...props }, ref) => {
    const generatedId = React.useId()
    const inputId = id ?? generatedId

    const [currentType, setCurrentType] = React.useState(type)

    const togglePasswordVisibility = () => {
      setCurrentType((prev) => (prev === "password" ? "text" : "password"))
    }

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium leading-none text-foreground"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3 flex items-center justify-center text-muted-foreground pointer-events-none">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={currentType}
            aria-invalid={!!error}
            className={cn(
              inputVariants({ variant, inputSize, className }),
              icon && "pl-10",
              type === "password" && "pr-10",
              error && "border-destructive focus-visible:ring-destructive"
            )}
            {...props}
          />

          {type === "password" && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              aria-label={currentType === "text" ? "Hide password" : "Show password"}
              className="absolute right-3 flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer focus:outline-none"
            >
              {currentType === "text" ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          )}
        </div>

        {error && <p className="text-xs font-medium text-destructive">{error}</p>}
      </div>
    )
  }
)

Input.displayName = "Input"

export { Input }