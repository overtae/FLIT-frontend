import { siGoogle } from "simple-icons";

import { SimpleIcon } from "@/components/simple-icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function GoogleButton({ className, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button
      variant="outline"
      size="icon"
      className={cn("h-12 w-12 rounded-full border-2 border-gray-200 bg-white hover:bg-gray-50", className)}
      {...props}
    >
      <SimpleIcon icon={siGoogle} className="size-5" />
    </Button>
  );
}
