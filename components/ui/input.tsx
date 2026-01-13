import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "w-full bg-transparent border-0 border-b border-minimal-border py-2.5 px-0 text-minimal-text-primary font-light transition-all duration-300 outline-none focus:border-minimal-accent placeholder:text-minimal-text-secondary/70 disabled:cursor-not-allowed disabled:opacity-50 rounded-none", // Enforce rounded-none
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
