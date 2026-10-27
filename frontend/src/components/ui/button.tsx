import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-[color:var(--brand-magenta-dark)] hover:scale-[1.02] glow-brand",
        secondary:
          "bg-[color:var(--brand-cyan)] text-white hover:bg-[color:var(--brand-cyan-dark)] hover:scale-[1.02] glow-cyan",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-border bg-card text-foreground hover:border-foreground/20 hover:bg-surface-low",
        ghost:
          "text-foreground hover:bg-surface-low hover:text-foreground",
        link: "text-[color:var(--brand-magenta-deep)] underline-offset-4 hover:underline",
        brand:
          "bg-primary text-primary-foreground hover:bg-[color:var(--brand-magenta-dark)] hover:scale-[1.02] glow-brand",
        "brand-outline":
          "border border-border bg-card text-foreground hover:border-[color:var(--brand-magenta)]/40 hover:bg-[color:var(--brand-magenta-soft)]/40 hover:text-[color:var(--brand-magenta-deep)]",
        "brand-ghost":
          "text-[color:var(--brand-magenta-deep)] hover:bg-[color:var(--brand-magenta-soft)]/60",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 px-4",
        lg: "h-12 px-7 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants }
