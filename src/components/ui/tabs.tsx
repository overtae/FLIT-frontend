"use client"

import * as React from "react"
import { Tabs as TabsPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

const tabStyles = {
  trigger: "relative h-auto border-0 bg-transparent px-0 pt-2 pb-2 text-base font-medium text-muted-foreground shadow-none before:absolute before:bottom-0 before:right-0 before:left-0 before:h-0.5 before:bg-primary before:opacity-0 before:content-[''] data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:before:opacity-100 data-[state=active]:font-semibold",
  list: "mb-4 h-auto gap-6 bg-transparent p-0 border-b border-border"
}

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "inline-flex h-auto w-fit items-center justify-center",
        tabStyles.list,
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex h-auto items-center justify-center gap-1.5 whitespace-nowrap border-0 bg-transparent px-4 py-2 transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        tabStyles.trigger,
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
