import { siNaver } from "simple-icons";

import { SimpleIcon } from "@/components/simple-icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function NaverButton({ className, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button
      variant="outline"
      size="icon"
      className={cn("h-12 w-12 rounded-full border-0 bg-[#03C75A] hover:bg-[#02b350]", className)}
      {...props}
    >
      <SimpleIcon icon={siNaver} className="size-6 text-white" />
    </Button>
  );
}
