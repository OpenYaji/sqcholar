"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import * as TabsPrimitive from "@radix-ui/react-tabs"

const Tabs = React.forwardRef((props, ref) => {
  const { className, ...otherProps } = props;
  return (
    <TabsPrimitive.Root
      {...otherProps}
      ref={ref}
      className={cn("w-full", className)}
    />
  );
});
Tabs.displayName = "Tabs";

const TabsList = React.forwardRef((props, ref) => {
  const { className, ...otherProps } = props;
  return (
    <TabsPrimitive.List
      {...otherProps}
      ref={ref}
      className={cn(
        "flex space-x-2",
        className
      )}
    />
  );
});
TabsList.displayName = "TabsList";

const TabsTrigger = React.forwardRef((props, ref) => {
    const { className, ...otherProps } = props;
  return (
    <TabsPrimitive.Trigger
      {...otherProps}
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center px-4 py-2 rounded-md font-medium text-sm",
        "transition-colors duration-200",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-sm",
        "data-[state=inactive]:hover:bg-gray-100 data-[state=inactive]:text-gray-700 dark:data-[state=inactive]:hover:bg-gray-800 dark:data-[state=inactive]:text-gray-300",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
    />
  );
});
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = React.forwardRef((props, ref) => {
    const { className, ...otherProps } = props;
  return (
    <TabsPrimitive.Content
      {...otherProps}
      ref={ref}
      className={cn(
        "mt-4 p-4 rounded-md border",
        className
      )}
    />
  );
});
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
