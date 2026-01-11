"use client";

import { format, parseISO } from "date-fns";
import { Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { SettlementDetail } from "@/types/settlement.type";

interface SettlementInfoCardProps {
  settlement: SettlementDetail;
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  isDatePickerOpen: boolean;
  onDatePickerOpenChange: (open: boolean) => void;
  onPaymentBreakdownClick: () => void;
}

export function SettlementInfoCard({
  settlement,
  selectedDate,
  onDateChange,
  isDatePickerOpen,
  onDatePickerOpenChange,
  onPaymentBreakdownClick,
}: SettlementInfoCardProps) {
  return (
    <section className="w-full space-y-3 sm:space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3 md:gap-4">
          <span className="text-sm font-semibold break-words sm:text-base">
            {settlement.user.nickname} ({settlement.user.loginId})
          </span>
          <span className="text-xs sm:text-sm">{settlement.user.phoneNumber}</span>
          <span className="text-xs break-words sm:text-sm">{settlement.user.mail}</span>
        </div>

        <Popover open={isDatePickerOpen} onOpenChange={onDatePickerOpenChange}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="justify-start text-left text-xs font-normal sm:text-sm">
              <Calendar className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">
                {selectedDate ? format(selectedDate, "yyyy년 MM월 dd일 EEEE") : "날짜 선택"}
              </span>
              <span className="sm:hidden">{selectedDate ? format(selectedDate, "MM/dd") : "날짜"}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                onDateChange(date);
                onDatePickerOpenChange(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      <hr />

      <div className="text-xs text-gray-600 sm:text-sm">
        최종 업데이트 일시 : {format(parseISO(settlement.lastUpdatedAt), "yyyy-MM-dd HH:mm")}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="basis-2/5 space-y-1.5 sm:space-y-2">
          <div className="text-xs font-medium text-gray-600 sm:text-sm">정산 금액</div>
          <div className="text-xl font-bold sm:text-2xl">{settlement.settlementAmount.toLocaleString()} 원</div>
        </div>

        <div className="grid basis-3/5 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:gap-8">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              <span className="text-xs text-gray-600 sm:text-sm">결제 금액</span>
              <Button
                variant="link"
                className="h-auto p-0 text-xs font-semibold sm:text-sm"
                onClick={onPaymentBreakdownClick}
              >
                {settlement.totalPaymentAmount.toLocaleString()}원
              </Button>
            </div>
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              <span className="text-xs text-gray-600 sm:text-sm">결제건수</span>
              <span className="text-xs font-semibold sm:text-sm">{settlement.paymentCount}건</span>
            </div>
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              <span className="text-xs text-gray-600 sm:text-sm">배달건</span>
              <span className="text-xs font-semibold sm:text-sm">{settlement.deliveryCount}건</span>
            </div>
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              <span className="text-xs text-gray-600 sm:text-sm">수수료</span>
              <span className="text-xs font-semibold sm:text-sm">{settlement.commission.toLocaleString()}원</span>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              <span className="text-xs text-gray-600 sm:text-sm">환불 | 취소 금액</span>
              <span className="text-xs font-semibold sm:text-sm">
                {settlement.refundCancelAmount.toLocaleString()}원
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              <span className="text-xs text-gray-600 sm:text-sm">환불 | 취소 건수</span>
              <span className="text-xs font-semibold sm:text-sm">{settlement.refundCancelCount}건</span>
            </div>
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              <span className="text-xs text-gray-600 sm:text-sm">배달료</span>
              <span className="text-xs font-semibold sm:text-sm">{settlement.deliveryAmount.toLocaleString()}원</span>
            </div>
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              <span className="text-xs text-gray-600 sm:text-sm">정산금액</span>
              <span className="text-xs font-semibold sm:text-sm">{settlement.settlementAmount.toLocaleString()}원</span>
            </div>
          </div>
        </div>
      </div>

      <hr />
    </section>
  );
}
