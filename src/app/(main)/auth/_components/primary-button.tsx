import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PrimaryButton({ className, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <div className="from-main to-main-accent rounded-full bg-linear-to-b p-[1px]">
      <Button variant="outline" size="icon" className={cn("rounded-full hover:bg-white/95", className)} {...props}>
        {props.children}
      </Button>
    </div>
  );
}
