import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-none border px-2.5 py-0.5 text-xs font-light transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", // Enforce rounded-none
  {
    variants: {
      variant: {
        default: "border-transparent bg-minimal-accent text-minimal-accent-foreground",
        secondary: "border-transparent bg-minimal-surface text-minimal-text-secondary",
        destructive: "border-transparent bg-minimal-destructive text-minimal-destructive-foreground",
        outline: "text-minimal-text-primary border-minimal-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
