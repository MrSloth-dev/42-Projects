import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-[color:var(--brand-magenta-soft)] text-[color:var(--brand-magenta-deep)]",
        secondary:
          "bg-[color:var(--brand-cyan-soft)] text-secondary-foreground",
        neutral:
          "bg-surface-low text-muted-foreground",
        outline:
          "border border-border bg-card text-muted-foreground",
        destructive:
          "bg-destructive/10 text-destructive",
        brand:
          "bg-[color:var(--brand-magenta-soft)] text-[color:var(--brand-magenta-deep)]",
        cyan:
          "bg-[color:var(--brand-cyan-soft)] text-secondary-foreground",
        language:
          "border border-border bg-card text-foreground/70",
        "brand-solid":
          "bg-primary text-primary-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export { Badge, badgeVariants }
