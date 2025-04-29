"use client"

import React from "react"
import { cn } from "../../lib/utils"
import { ChevronDown } from "lucide-react"
import { Check } from "lucide-react"

const Select = React.forwardRef(({ children, value, onValueChange, defaultValue, ...props }, ref) => {
  const [selectedValue, setSelectedValue] = React.useState(value || defaultValue || "")
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value)
    }
  }, [value])

  const handleValueChange = (newValue) => {
    setSelectedValue(newValue)
    if (onValueChange) {
      onValueChange(newValue)
    }
    setOpen(false)
  }

  return (
    <div ref={ref} {...props}>
      {React.Children.map(children, (child) => {
        if (child.type.displayName === "SelectTrigger") {
          return React.cloneElement(child, {
            onClick: () => setOpen(!open),
            value: selectedValue,
          })
        }
        if (child.type.displayName === "SelectContent") {
          return open
            ? React.cloneElement(child, {
                onValueChange: handleValueChange,
                value: selectedValue,
              })
            : null
        }
        return child
      })}
    </div>
  )
})
Select.displayName = "Select"

const SelectTrigger = React.forwardRef(({ className, children, onClick, value, ...props }, ref) => {
  return (
    <button
      ref={ref}
      onClick={onClick}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (child.type.displayName === "SelectValue") {
          return React.cloneElement(child, { value })
        }
        return child
      })}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  )
})
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = React.forwardRef(({ className, children, placeholder, value, ...props }, ref) => {
  return (
    <span ref={ref} className={cn("flex-grow text-left", className)} {...props}>
      {value || placeholder || children || "Select an option"}
    </span>
  )
})
SelectValue.displayName = "SelectValue"

const SelectContent = React.forwardRef(({ className, children, onValueChange, value, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80",
        className,
      )}
      {...props}
    >
      <div className="w-full p-1">
        {React.Children.map(children, (child) => {
          if (child.type.displayName === "SelectItem") {
            return React.cloneElement(child, {
              onSelect: () => onValueChange(child.props.value),
              isSelected: value === child.props.value,
            })
          }
          return child
        })}
      </div>
    </div>
  )
})
SelectContent.displayName = "SelectContent"

const SelectItem = React.forwardRef(({ className, children, value, onSelect, isSelected, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        isSelected ? "bg-accent text-accent-foreground" : "",
        className,
      )}
      onClick={onSelect}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {isSelected && <Check className="h-4 w-4" />}
      </span>
      <span className="truncate">{children}</span>
    </div>
  )
})
SelectItem.displayName = "SelectItem"

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
