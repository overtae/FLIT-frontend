"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onEnter?: (value: string) => void;
  placeholder?: string;
  className?: string;
  iconPosition?: "left" | "right";
  resetPagination?: () => void;
}

export function SearchInput({
  value,
  onChange,
  onEnter,
  placeholder = "",
  className,
  iconPosition = "right",
  resetPagination,
}: SearchInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    resetPagination?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onEnter) {
      onEnter(e.currentTarget.value);
    }
  };

  return (
    <div className={cn("relative", !className?.includes("w-") && iconPosition === "left" ? "w-[200px]" : !className?.includes("w-") && "w-[300px]")}>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className={cn(
          "h-9",
          iconPosition === "left" ? "rounded-full pl-8" : "rounded-full pr-10 pl-4",
          className
        )}
      />
      <Search
        className={cn(
          "text-muted-foreground absolute top-2.5 h-4 w-4",
          iconPosition === "left" ? "left-2" : "right-3"
        )}
      />
    </div>
  );
}

