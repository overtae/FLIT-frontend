import * as React from "react";
import { cn } from "@/lib/utils";

function Subtitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <h3
      data-slot="card-header"
      className={cn(
        "text-xl font-bold text-foreground",
        className
      )}
      {...props}
    />
  )
}

export {Subtitle}