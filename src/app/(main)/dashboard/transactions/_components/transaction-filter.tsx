"use client";

import * as React from "react";

import { Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { PaymentMethod, RefundStatus, TransactionType } from "./transaction-types";

interface TransactionFilterProps {
  type: "order" | "order-request" | "canceled";
  onFilterChange?: (filters: {
    types?: TransactionType[];
    paymentMethods?: PaymentMethod[];
    refundStatuses?: RefundStatus[];
    date?: Date;
  }) => void;
}

export function TransactionFilter({ type, onFilterChange }: TransactionFilterProps) {
  const [selectedTypes, setSelectedTypes] = React.useState<TransactionType[]>([]);
  const [selectedPaymentMethods, setSelectedPaymentMethods] = React.useState<PaymentMethod[]>([]);
  const [selectedRefundStatuses, setSelectedRefundStatuses] = React.useState<RefundStatus[]>([]);
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [dateEnabled, setDateEnabled] = React.useState(false);

  const handleReset = () => {
    setSelectedTypes([]);
    setSelectedPaymentMethods([]);
    setSelectedRefundStatuses([]);
    setDate(undefined);
    setDateEnabled(false);
    onFilterChange?.({});
  };

  const handleDone = () => {
    onFilterChange?.({
      types: selectedTypes.length > 0 ? selectedTypes : undefined,
      paymentMethods: selectedPaymentMethods.length > 0 ? selectedPaymentMethods : undefined,
      refundStatuses: selectedRefundStatuses.length > 0 ? selectedRefundStatuses : undefined,
      date: dateEnabled ? date : undefined,
    });
  };

  const toggleType = (type: TransactionType) => {
    setSelectedTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]));
  };

  const togglePaymentMethod = (method: PaymentMethod) => {
    setSelectedPaymentMethods((prev) => (prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method]));
  };

  const toggleRefundStatus = (status: RefundStatus) => {
    setSelectedRefundStatuses((prev) => (prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Settings2 className="text-muted-foreground h-4 w-4" />
          <span className="sr-only">필터 설정</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-4" align="end">
        <div className="space-y-4">
          {type === "order" && (
            <>
              <div className="space-y-3">
                <Label className="text-sm font-medium">구분</Label>
                {(["바로고", "픽업", "기타"] as TransactionType[]).map((typeOption) => (
                  <div key={typeOption} className="flex items-center space-x-2">
                    <Checkbox
                      id={`filter-type-${typeOption}`}
                      checked={selectedTypes.includes(typeOption)}
                      onCheckedChange={() => toggleType(typeOption)}
                    />
                    <Label htmlFor={`filter-type-${typeOption}`} className="cursor-pointer text-sm font-normal">
                      {typeOption}
                    </Label>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">결제방법</Label>
                {(["플릿결제", "POS결제", "계좌이체", "카드결제"] as PaymentMethod[]).map((method) => (
                  <div key={method} className="flex items-center space-x-2">
                    <Checkbox
                      id={`filter-payment-${method}`}
                      checked={selectedPaymentMethods.includes(method)}
                      onCheckedChange={() => togglePaymentMethod(method)}
                    />
                    <Label htmlFor={`filter-payment-${method}`} className="cursor-pointer text-sm font-normal">
                      {method}
                    </Label>
                  </div>
                ))}
              </div>
            </>
          )}

          {type === "canceled" && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">환불 상태</Label>
              {(["환불처리", "환불미처리"] as RefundStatus[]).map((status) => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox
                    id={`filter-refund-${status}`}
                    checked={selectedRefundStatuses.includes(status)}
                    onCheckedChange={() => toggleRefundStatus(status)}
                  />
                  <Label htmlFor={`filter-refund-${status}`} className="cursor-pointer text-sm font-normal">
                    {status}
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
                setDateEnabled(!!checked);
                if (!checked) {
                  setDate(undefined);
                }
              }}
            />
            <Label htmlFor="filter-date" className="cursor-pointer text-sm font-normal">
              날짜선택
            </Label>
          </div>

          {dateEnabled && (
            <div className="rounded-md border shadow-sm">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus className="p-2" />
            </div>
          )}

          <div className="flex flex-col gap-2 pt-2">
            <Button
              onClick={handleReset}
              className="h-8 w-full rounded-full bg-gray-600 text-xs text-white hover:bg-gray-700"
            >
              Reset
            </Button>
            <Button onClick={handleDone} variant="outline" className="h-8 w-full rounded-full border-gray-200 text-xs">
              Done
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
