"use client";

import { useEffect, useRef, HTMLProps } from "react";

import { cn } from "@/lib/utils";

interface IndeterminateCheckboxProps extends Omit<HTMLProps<HTMLInputElement>, "type"> {
  indeterminate?: boolean;
}

export function IndeterminateCheckbox({ indeterminate, className, ...rest }: IndeterminateCheckboxProps) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) {
      // checked이면서 indeterminate면 대시 표시
      ref.current.indeterminate = !!indeterminate;
    }
  }, [indeterminate, rest.checked]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={cn(
        "text-primary focus:ring-primary accent-primary h-4 w-4 cursor-pointer rounded border-gray-300 focus:ring-2",
        className,
      )}
      {...rest}
    />
  );
}
