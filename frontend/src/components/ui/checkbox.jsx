"use client"

import React from "react"
import { cn } from "../../lib/utils"
import { Check } from "lucide-react"

const Checkbox = React.forwardRef(({ className, checked, onCheckedChange, ...props }, ref) => {
  const [isChecked, setIsChecked] = React.useState(checked || false)

  React.useEffect(() => {
    setIsChecked(checked || false)
  }, [checked])

  const handleChange = (event) => {
    const newChecked = event.target.checked
    setIsChecked(newChecked)
    if (onCheckedChange) {
      onCheckedChange(newChecked)
    }
  }

  return (
    <div className="relative">
      <input
        type="checkbox"
        ref={ref}
        checked={isChecked}
        onChange={handleChange}
        className="peer absolute h-4 w-4 opacity-0"
        {...props}
      />
      <div
        className={cn(
          "flex h-4 w-4 items-center justify-center rounded-sm border border-primary ring-offset-background",
          "peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2",
          isChecked ? "bg-primary text-primary-foreground" : "border-primary",
          className,
        )}
      >
        {isChecked && <Check className="h-3 w-3" />}
      </div>
    </div>
  )
})
Checkbox.displayName = "Checkbox"

export { Checkbox }
