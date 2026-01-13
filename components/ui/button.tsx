"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap transition-all duration-300 relative overflow-hidden uppercase tracking-wider text-xs font-light rounded-none", // Enforce rounded-none
  {
    variants: {
      variant: {
        default:
          "bg-minimal-accent text-minimal-accent-foreground hover:bg-minimal-accent/90 hover:translate-y-[-2px] shadow-sm",
        destructive: "bg-minimal-destructive text-minimal-destructive-foreground hover:bg-minimal-destructive/90",
        outline:
          "border border-minimal-border bg-transparent text-minimal-text-primary hover:border-minimal-border-hover hover:bg-minimal-surface hover:translate-y-[-2px]",
        secondary: "bg-minimal-surface text-minimal-text-primary hover:bg-minimal-card hover:translate-y-[-2px]",
        ghost: "hover:bg-minimal-surface text-minimal-text-primary",
        link: "text-minimal-accent underline-offset-4 hover:underline p-0",
        text: "bg-transparent text-minimal-text-secondary p-3 pl-0 min-w-0 relative after:content-[''] after:absolute after:w-0 after:h-[1px] after:bottom-2 after:left-0 after:bg-minimal-accent after:transition-all after:duration-300 hover:text-minimal-text-primary hover:after:w-full",
        icon: "w-10 h-10 p-0 min-w-0 flex items-center justify-center bg-transparent border border-minimal-border hover:border-minimal-border-hover hover:bg-minimal-surface",
      },
      size: {
        default: "h-11 py-3 px-6",
        sm: "h-9 px-4",
        lg: "h-12 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  triggerCopilot?: boolean
  labelAbove?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, triggerCopilot = false, onClick, labelAbove, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    // const { toggleCopilot } = useVoiceCopilot(); // Assuming useVoiceCopilot is set up correctly

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (triggerCopilot) {
        try {
          // toggleCopilot(); // Uncomment if useVoiceCopilot is used
          console.log("Voice copilot triggered (placeholder)")
        } catch (error) {
          console.warn("Error toggling copilot:", error)
        }
      }
      if (onClick) {
        onClick(event)
      }
    }

    const buttonElement = (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} onClick={handleClick} {...props} />
    )

    if (labelAbove) {
      return (
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-minimal-text-secondary">{labelAbove}</p>
          {buttonElement}
        </div>
      )
    }

    // If labelAbove is not provided, render the button directly.
    // This ensures the button renders even if labelAbove is undefined.
    return buttonElement
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
