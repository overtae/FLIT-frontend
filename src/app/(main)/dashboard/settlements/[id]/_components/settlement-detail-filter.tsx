"use client";

import * as React from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { format } from "date-fns";
import { Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const paymentMethods = ["플릿결제", "POS결제", "계좌이체", "환불"];

export function SettlementDetailFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedPaymentMethods, setSelectedPaymentMethods] = React.useState<string[]>(() => {
    const methods = searchParams.get("paymentMethods");
    return methods ? methods.split(",") : [];
  });
  const [dateEnabled, setDateEnabled] = React.useState(() => {
    return searchParams.get("date") !== null;
  });
  const [date, setDate] = React.useState<Date | undefined>(() => {
    const dateParam = searchParams.get("date");
    return dateParam ? new Date(dateParam) : undefined;
  });

  const updateURL = React.useCallback(
    (paymentMethods: string[], dateEnabled: boolean, date?: Date) => {
      const params = new URLSearchParams(searchParams.toString());

      if (paymentMethods.length > 0) {
        params.set("paymentMethods", paymentMethods.join(","));
      } else {
        params.delete("paymentMethods");
      }

      if (dateEnabled && date) {
        params.set("date", format(date, "yyyy-MM-dd"));
      } else {
        params.delete("date");
      }

      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const togglePaymentMethod = (method: string) => {
    const newMethods = selectedPaymentMethods.includes(method)
      ? selectedPaymentMethods.filter((m) => m !== method)
      : [...selectedPaymentMethods, method];
    setSelectedPaymentMethods(newMethods);
    updateURL(newMethods, dateEnabled, date);
  };

  const handleReset = () => {
    setSelectedPaymentMethods([]);
    setDateEnabled(false);
    setDate(undefined);
    updateURL([], false);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Settings2 className="text-muted-foreground h-4 w-4" />
          <span className="sr-only">필터 설정</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-h-[80vh] w-[280px] overflow-y-auto p-4" align="end">
        <div className="space-y-4">
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div key={method} className="flex items-center space-x-2">
                <Checkbox
                  id={`filter-${method}`}
                  checked={selectedPaymentMethods.includes(method)}
                  onCheckedChange={() => togglePaymentMethod(method)}
                />
                <Label
                  htmlFor={`filter-${method}`}
                  className="cursor-pointer text-sm leading-none font-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {method}
                </Label>
              </div>
            ))}
            <div className="mt-2 flex items-center space-x-2 border-t pt-1">
              <Checkbox
                id="filter-date"
                checked={dateEnabled}
                onCheckedChange={(checked) => {
                  const newEnabled = !!checked;
                  setDateEnabled(newEnabled);
                  if (!newEnabled) {
                    setDate(undefined);
                  }
                  updateURL(selectedPaymentMethods, newEnabled, newEnabled ? date : undefined);
                }}
              />
              <Label htmlFor="filter-date" className="cursor-pointer text-sm font-normal">
                날짜선택
              </Label>
            </div>
          </div>

          {dateEnabled && (
            <div className="rounded-md border shadow-sm">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => {
                  setDate(newDate);
                  updateURL(selectedPaymentMethods, dateEnabled, newDate);
                }}
                initialFocus
                className="p-2"
              />
            </div>
          )}

          <div className="flex flex-col gap-2 pt-2">
            <Button
              onClick={handleReset}
              className="h-8 w-full rounded-full bg-gray-600 text-xs text-white hover:bg-gray-700"
            >
              Reset
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
