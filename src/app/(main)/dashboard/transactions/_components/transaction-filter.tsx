"use client";

import * as React from "react";

import { Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SERVICE_CONFIG } from "@/config/service-config";
import type { PaymentMethod, RefundStatus, TransactionType } from "@/types/transaction.type";

interface TransactionFilterProps {
  type: "order" | "order-request" | "canceled";
  selectedTypes: TransactionType[];
  onTypesChange: (types: TransactionType[]) => void;
  selectedPaymentMethods: PaymentMethod[];
  onPaymentMethodsChange: (methods: PaymentMethod[]) => void;
  selectedRefundStatuses: RefundStatus[];
  onRefundStatusesChange: (statuses: RefundStatus[]) => void;
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
}

export function TransactionFilter({
  type,
  selectedTypes,
  onTypesChange,
  selectedPaymentMethods,
  onPaymentMethodsChange,
  selectedRefundStatuses,
  onRefundStatusesChange,
  selectedDate,
  onDateChange,
}: TransactionFilterProps) {
  const [dateEnabled, setDateEnabled] = React.useState(!!selectedDate);

  const transactionTypeEntries = React.useMemo(() => Object.entries(SERVICE_CONFIG.transactionType), []);
  const paymentMethodEntries = React.useMemo(() => Object.entries(SERVICE_CONFIG.paymentMethod), []);
  const refundStatusEntries = React.useMemo(() => Object.entries(SERVICE_CONFIG.refundStatus), []);

  const toggleType = React.useCallback(
    (typeKey: TransactionType) => {
      const newTypes = selectedTypes.includes(typeKey)
        ? selectedTypes.filter((t) => t !== typeKey)
        : [...selectedTypes, typeKey];
      onTypesChange(newTypes);
    },
    [selectedTypes, onTypesChange],
  );

  const togglePaymentMethod = React.useCallback(
    (methodKey: PaymentMethod) => {
      const newMethods = selectedPaymentMethods.includes(methodKey)
        ? selectedPaymentMethods.filter((m) => m !== methodKey)
        : [...selectedPaymentMethods, methodKey];
      onPaymentMethodsChange(newMethods);
    },
    [selectedPaymentMethods, onPaymentMethodsChange],
  );

  const toggleRefundStatus = React.useCallback(
    (statusKey: RefundStatus) => {
      const newStatuses = selectedRefundStatuses.includes(statusKey)
        ? selectedRefundStatuses.filter((s) => s !== statusKey)
        : [...selectedRefundStatuses, statusKey];
      onRefundStatusesChange(newStatuses);
    },
    [selectedRefundStatuses, onRefundStatusesChange],
  );

  const handleReset = () => {
    onTypesChange([]);
    onPaymentMethodsChange([]);
    onRefundStatusesChange([]);
    onDateChange(undefined);
    setDateEnabled(false);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Settings2 className="text-muted-foreground h-4 w-4" />
          <span className="sr-only">필터 설정</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-h-[80vh] w-[300px] overflow-y-auto p-4" align="end">
        <div className="space-y-4">
          {type === "order" && (
            <>
              <div className="space-y-3">
                <Label className="text-sm font-medium">구분</Label>
                {transactionTypeEntries
                  .filter(([key]) => key === "BAROGO" || key === "PICKUP" || key === "ETC")
                  .map(([typeKey, typeLabel]) => (
                    <div key={typeKey} className="flex items-center space-x-2">
                      <Checkbox
                        id={`filter-type-${typeKey}`}
                        checked={selectedTypes.includes(typeKey as TransactionType)}
                        onCheckedChange={() => toggleType(typeKey as TransactionType)}
                      />
                      <Label htmlFor={`filter-type-${typeKey}`} className="cursor-pointer text-sm font-normal">
                        {typeLabel}
                      </Label>
                    </div>
                  ))}
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">결제방법</Label>
                {paymentMethodEntries
                  .filter(([key]) => key === "FLIT" || key === "POS" || key === "BANK_TRANSFER" || key === "CARD")
                  .map(([methodKey, methodLabel]) => (
                    <div key={methodKey} className="flex items-center space-x-2">
                      <Checkbox
                        id={`filter-payment-${methodKey}`}
                        checked={selectedPaymentMethods.includes(methodKey as PaymentMethod)}
                        onCheckedChange={() => togglePaymentMethod(methodKey as PaymentMethod)}
                      />
                      <Label htmlFor={`filter-payment-${methodKey}`} className="cursor-pointer text-sm font-normal">
                        {methodLabel}
                      </Label>
                    </div>
                  ))}
              </div>
            </>
          )}

          {type === "canceled" && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">환불 상태</Label>
              {refundStatusEntries.map(([statusKey, statusLabel]) => (
                <div key={statusKey} className="flex items-center space-x-2">
                  <Checkbox
                    id={`filter-refund-${statusKey}`}
                    checked={selectedRefundStatuses.includes(statusKey as RefundStatus)}
                    onCheckedChange={() => toggleRefundStatus(statusKey as RefundStatus)}
                  />
                  <Label htmlFor={`filter-refund-${statusKey}`} className="cursor-pointer text-sm font-normal">
                    {statusLabel}
                  </Label>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center space-x-2 border-t pt-3">
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
            />
            <Label htmlFor="filter-date" className="cursor-pointer text-sm font-normal">
              날짜선택
            </Label>
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
