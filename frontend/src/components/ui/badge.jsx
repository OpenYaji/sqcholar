"use client"

import React from "react"
import { cn } from "@/lib/utils"

/**
 * Badge component for displaying small status indicators
 * 
 * @param {Object} props - Component props
 * @param {string} [props.variant="default"] - Visual style variant
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} The Badge component
 */
function Badge({ className, variant = "default", ...props }) {
  const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
  
  const variantClasses = {
    default: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    secondary: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    destructive: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    outline: "border border-current text-current",
    success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    purple: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    orange: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    green: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    yellow: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    pink: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
    gray: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  }

  return (
    <div className={cn(baseClasses, variantClasses[variant] || variantClasses.default, className)} {...props} />
  )
}

export { Badge }