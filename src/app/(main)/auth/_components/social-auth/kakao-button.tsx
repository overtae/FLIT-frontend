import { siKakaotalk } from "simple-icons";

import { SimpleIcon } from "@/components/simple-icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function KakaoButton({ className, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button
      variant="outline"
      size="icon"
      className={cn("h-12 w-12 rounded-full border-0 bg-[#FEE500] hover:bg-[#e5ce00]", className)}
      {...props}
    >
      <SimpleIcon icon={siKakaotalk} className="size-6 text-[#000000]" />
    </Button>
  );
}
