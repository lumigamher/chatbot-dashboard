import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

const Button = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg focus-visible:outline-none disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props} />
  )
})
Button.displayName = "Button"

export { Button }