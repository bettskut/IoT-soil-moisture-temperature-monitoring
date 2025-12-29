import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition-all",
        "dark:bg-green-500 dark:hover:bg-green-600",
        className
      )}
      {...props}
    />
  )
)

Button.displayName = "Button"

export { Button }
