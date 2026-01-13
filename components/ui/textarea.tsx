import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full border border-minimal-border bg-minimal-surface px-3 py-2 text-sm text-minimal-text-primary ring-offset-minimal-background placeholder:text-minimal-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-minimal-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-none", // Enforce rounded-none, use semantic colors
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
