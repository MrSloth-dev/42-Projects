import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        // 42 Projects Gruvbox variants
        "42-type": "text-[color:var(--color-42-accent)] border-[color:var(--color-42-accent)]/50 bg-[color:var(--color-42-surface-variant)]/50",
        "42-solo": "text-[color:var(--gb-bright-orange)] border-[color:var(--gb-neutral-orange)]/50 bg-[color:var(--gb-neutral-orange)]/20",
        "42-group": "text-[color:var(--gb-bright-aqua)] border-[color:var(--gb-neutral-aqua)]/50 bg-[color:var(--gb-neutral-aqua)]/20",
        "42-language": "bg-[color:var(--color-42-surface)] text-[color:var(--color-42-primary)] border-[color:var(--color-border)]",
        "42-count": "text-[color:var(--color-42-primary)] border-[color:var(--color-42-primary)]/50 bg-[color:var(--color-42-surface-variant)]/50",
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

export { Badge, badgeVariants }
