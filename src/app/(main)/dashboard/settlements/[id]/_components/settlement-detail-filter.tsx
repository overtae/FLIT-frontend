"use client";

import * as React from "react";

import { Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SERVICE_CONFIG } from "@/config/service-config";
import type { PaymentMethod } from "@/types/transaction.type";

interface SettlementDetailFilterProps {
  selectedPaymentMethods: PaymentMethod[];
  onPaymentMethodsChange: (methods: PaymentMethod[]) => void;
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
}

export function SettlementDetailFilter({
  selectedPaymentMethods,
  onPaymentMethodsChange,
  selectedDate,
  onDateChange,
}: SettlementDetailFilterProps) {
  const [dateEnabled, setDateEnabled] = React.useState(!!selectedDate);

  const paymentMethodEntries = React.useMemo(() => Object.entries(SERVICE_CONFIG.paymentMethod), []);

  const togglePaymentMethod = React.useCallback(
    (methodKey: PaymentMethod) => {
      const newMethods = selectedPaymentMethods.includes(methodKey)
        ? selectedPaymentMethods.filter((m) => m !== methodKey)
        : [...selectedPaymentMethods, methodKey];
      onPaymentMethodsChange(newMethods);
    },
    [selectedPaymentMethods, onPaymentMethodsChange],
  );

  const handleReset = () => {
    onPaymentMethodsChange([]);
    setDateEnabled(false);
    onDateChange(undefined);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Settings2 className="text-muted-foreground h-4 w-4" />
          <span className="sr-only">필터 설정</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-h-[80vh] w-[calc(100vw-2rem)] overflow-y-auto p-3 sm:w-[280px] sm:p-4" align="end">
        <div className="space-y-3 sm:space-y-4">
          <div className="space-y-2 sm:space-y-3">
            {paymentMethodEntries
              .filter(([key]) => key === "FLIT" || key === "POS" || key === "BANK_TRANSFER" || key === "CARD")
              .map(([methodKey, methodLabel]) => (
                <div key={methodKey} className="flex items-center space-x-2">
                  <Checkbox
                    id={`filter-${methodKey}`}
                    checked={selectedPaymentMethods.includes(methodKey as PaymentMethod)}
                    onCheckedChange={() => togglePaymentMethod(methodKey as PaymentMethod)}
                    className="h-4 w-4 sm:h-5 sm:w-5"
                  />
                  <Label
                    htmlFor={`filter-${methodKey}`}
                    className="cursor-pointer text-xs leading-none font-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sm:text-sm"
                  >
                    {methodLabel}
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
                    onDateChange(undefined);
                  }
                }}
                className="h-4 w-4 sm:h-5 sm:w-5"
              />
              <Label htmlFor="filter-date" className="cursor-pointer text-xs font-normal sm:text-sm">
                날짜선택
              </Label>
            </div>
          </div>

          {dateEnabled && (
            <div className="rounded-md border shadow-sm">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(newDate) => {
                  onDateChange(newDate);
                }}
                initialFocus
                className="p-1 sm:p-2"
              />
            </div>
          )}

          <div className="flex flex-col gap-2 pt-2">
            <Button
              onClick={handleReset}
              className="h-7 w-full rounded-full bg-gray-600 text-xs text-white hover:bg-gray-700 sm:h-8"
            >
              Reset
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
