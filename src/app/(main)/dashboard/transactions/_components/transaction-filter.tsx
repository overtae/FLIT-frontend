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

import { PaymentMethod, RefundStatus, TransactionType } from "./transaction-types";

interface TransactionFilterProps {
  type: "order" | "order-request" | "canceled";
}

export function TransactionFilter({ type }: TransactionFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedTypes, setSelectedTypes] = React.useState<TransactionType[]>(() => {
    const types = searchParams.get("types");
    return types ? (types.split(",") as TransactionType[]) : [];
  });
  const [selectedPaymentMethods, setSelectedPaymentMethods] = React.useState<PaymentMethod[]>(() => {
    const methods = searchParams.get("paymentMethods");
    return methods ? (methods.split(",") as PaymentMethod[]) : [];
  });
  const [selectedRefundStatuses, setSelectedRefundStatuses] = React.useState<RefundStatus[]>(() => {
    const statuses = searchParams.get("refundStatuses");
    return statuses ? (statuses.split(",") as RefundStatus[]) : [];
  });
  const [dateEnabled, setDateEnabled] = React.useState(() => {
    return searchParams.get("date") !== null;
  });
  const [date, setDate] = React.useState<Date | undefined>(() => {
    const dateParam = searchParams.get("date");
    return dateParam ? new Date(dateParam) : undefined;
  });

  const updateURL = React.useCallback(
    (types?: TransactionType[], paymentMethods?: PaymentMethod[], refundStatuses?: RefundStatus[], date?: Date) => {
      const params = new URLSearchParams(searchParams.toString());

      if (types && types.length > 0) {
        params.set("types", types.join(","));
      } else {
        params.delete("types");
      }

      if (paymentMethods && paymentMethods.length > 0) {
        params.set("paymentMethods", paymentMethods.join(","));
      } else {
        params.delete("paymentMethods");
      }

      if (refundStatuses && refundStatuses.length > 0) {
        params.set("refundStatuses", refundStatuses.join(","));
      } else {
        params.delete("refundStatuses");
      }

      if (date) {
        params.set("date", format(date, "yyyy-MM-dd"));
      } else {
        params.delete("date");
      }

      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const toggleType = (type: TransactionType) => {
    const newTypes = selectedTypes.includes(type) ? selectedTypes.filter((t) => t !== type) : [...selectedTypes, type];
    setSelectedTypes(newTypes);
    updateURL(
      newTypes.length > 0 ? newTypes : undefined,
      selectedPaymentMethods.length > 0 ? selectedPaymentMethods : undefined,
      selectedRefundStatuses.length > 0 ? selectedRefundStatuses : undefined,
      dateEnabled ? date : undefined,
    );
  };

  const togglePaymentMethod = (method: PaymentMethod) => {
    const newMethods = selectedPaymentMethods.includes(method)
      ? selectedPaymentMethods.filter((m) => m !== method)
      : [...selectedPaymentMethods, method];
    setSelectedPaymentMethods(newMethods);
    updateURL(
      selectedTypes.length > 0 ? selectedTypes : undefined,
      newMethods.length > 0 ? newMethods : undefined,
      selectedRefundStatuses.length > 0 ? selectedRefundStatuses : undefined,
      dateEnabled ? date : undefined,
    );
  };

  const toggleRefundStatus = (status: RefundStatus) => {
    const newStatuses = selectedRefundStatuses.includes(status)
      ? selectedRefundStatuses.filter((s) => s !== status)
      : [...selectedRefundStatuses, status];
    setSelectedRefundStatuses(newStatuses);
    updateURL(
      selectedTypes.length > 0 ? selectedTypes : undefined,
      selectedPaymentMethods.length > 0 ? selectedPaymentMethods : undefined,
      newStatuses.length > 0 ? newStatuses : undefined,
      dateEnabled ? date : undefined,
    );
  };

  const handleReset = () => {
    setSelectedTypes([]);
    setSelectedPaymentMethods([]);
    setSelectedRefundStatuses([]);
    setDate(undefined);
    setDateEnabled(false);
    updateURL();
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
                const newEnabled = !!checked;
                setDateEnabled(newEnabled);
                if (!newEnabled) {
                  setDate(undefined);
                }
                updateURL(
                  selectedTypes.length > 0 ? selectedTypes : undefined,
                  selectedPaymentMethods.length > 0 ? selectedPaymentMethods : undefined,
                  selectedRefundStatuses.length > 0 ? selectedRefundStatuses : undefined,
                  newEnabled ? date : undefined,
                );
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
                selected={date}
                onSelect={(newDate) => {
                  setDate(newDate);
                  updateURL(
                    selectedTypes.length > 0 ? selectedTypes : undefined,
                    selectedPaymentMethods.length > 0 ? selectedPaymentMethods : undefined,
                    selectedRefundStatuses.length > 0 ? selectedRefundStatuses : undefined,
                    newDate,
                  );
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
