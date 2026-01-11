"use client";

import * as React from "react";

import { Tabs as TabsPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

type Variant = "fullWidth" | "fitContent";

interface TabsContextValue {
  variant?: Variant;
  spacing?: number;
}

const TabsContext = React.createContext<TabsContextValue>({});

const tabStyles = {
  trigger:
    "relative border border-white data-[state=active]:border-gray-400 data-[state=active]:border-b-transparent bg-transparent px-6 py-2 text-sm lg:text-lg font-bold text-gray-400 shadow-none data-[state=active]:bg-transparent data-[state=active]:text-main data-[state=active]:shadow-none data-[state=active]:after:absolute data-[state=active]:after:-bottom-1 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-2 data-[state=active]:after:bg-background data-[state=active]:after:content-[''] data-[state=active]:after:z-20",
  list: "h-fit gap-8 bg-transparent p-0",
};

interface TabsProps extends React.ComponentProps<typeof TabsPrimitive.Root> {
  variant?: Variant;
  spacing?: number;
}

function Tabs({ className, variant, spacing = 0, ...props }: TabsProps) {
  const contextValue = React.useMemo(() => ({ variant, spacing }), [variant, spacing]);

  return (
    <TabsContext.Provider value={contextValue}>
      <TabsPrimitive.Root data-slot="tabs" className={cn("flex flex-col gap-0", className)} {...props} />
    </TabsContext.Provider>
  );
}

function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  const { variant, spacing } = React.useContext(TabsContext);

  const listStyles = React.useMemo(() => {
    if (variant === "fullWidth" && spacing !== undefined) {
      return {
        gap: `${spacing}px`,
      };
    }
    return {};
  }, [variant, spacing]);

  return (
    <div
      className="scrollbar-transparent max-w-full overflow-x-auto overflow-y-clip pb-1"
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <style jsx>{`
        .scrollbar-transparent::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <TabsPrimitive.List
        data-slot="tabs-list"
        className={cn(
          "bg-muted text-muted-foreground inline-flex items-center justify-start p-[3px]",
          tabStyles.list,
          className,
        )}
        style={listStyles}
        {...props}
      />
    </div>
  );
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const { variant } = React.useContext(TabsContext);

  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground relative z-10 inline-flex flex-1 items-center justify-center gap-1.5 px-2 py-1 whitespace-nowrap transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        tabStyles.trigger,
        variant === "fullWidth" && "flex-1",
        variant === "fitContent" && "flex-initial",
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
      className={cn("relative -mt-1 box-border flex-1 border border-gray-400 p-4 pt-5 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
