"use client"

import React, { useState, useRef, useEffect } from "react"
import { cn } from "../../lib/utils"

const DropdownMenu = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Handle clicking outside to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Find the trigger and content from children
  let trigger = null
  let content = null

  React.Children.forEach(children, (child) => {
    if (child && child.type) {
      if (child.type.displayName === "DropdownMenuTrigger") {
        trigger = child
      } else if (child.type.displayName === "DropdownMenuContent") {
        content = child
      }
    }
  })

  // Clone the trigger with the click handler
  const clonedTrigger = trigger
    ? React.cloneElement(trigger, {
        onClick: (e) => {
          e.stopPropagation()
          setIsOpen(!isOpen)
          if (trigger.props.onClick) {
            trigger.props.onClick(e)
          }
        },
      })
    : null

  return (
    <div className="relative" ref={dropdownRef}>
      {clonedTrigger}
      {isOpen && content}
    </div>
  )
}

const DropdownMenuTrigger = ({ children, className, ...props }) => {
  return React.cloneElement(children, {
    className: cn(className, children.props.className),
    ...props,
  })
}
DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

const DropdownMenuContent = ({ children, className, align = "end", ...props }) => {
  return (
    <div
      className={cn(
        "absolute z-50 mt-1 min-w-[8rem] overflow-hidden rounded-md border bg-white dark:bg-gray-800 p-1 shadow-md",
        align === "start" && "left-0",
        align === "center" && "left-1/2 -translate-x-1/2",
        align === "end" && "right-0",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
DropdownMenuContent.displayName = "DropdownMenuContent"

const DropdownMenuItem = ({ children, className, ...props }) => {
  return (
    <button
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100 dark:hover:bg-gray-700",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
DropdownMenuItem.displayName = "DropdownMenuItem"

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem }
