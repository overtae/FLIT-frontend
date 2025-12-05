"use client";

import * as React from "react";

import { Tabs as TabsPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

const tabStyles = {
  trigger:
    "relative border border-white data-[state=active]:border-gray-400 data-[state=active]:border-b-white bg-transparent px-6 py-2 text-lg font-bold text-gray-400 shadow-none data-[state=active]:bg-transparent data-[state=active]:text-main data-[state=active]:shadow-none data-[state=active]:before:opacity-100 before:absolute before:-bottom-1 before:right-0 before:left-0 before:h-2 before:bg-white before:opacity-0 before:content-['']",
  list: "h-auto gap-8 bg-transparent p-0",
};

function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root data-slot="tabs" className={cn("flex flex-col gap-0", className)} {...props} />;
}

function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "bg-muted text-muted-foreground inline-flex w-fit items-center justify-center rounded-lg p-[3px]",
        tabStyles.list,
        className,
      )}
      {...props}
    />
  );
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground z-10 inline-flex flex-1 items-center justify-center gap-1.5 px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        tabStyles.trigger,
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("box-border flex-1 border border-gray-400 pt-1 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
