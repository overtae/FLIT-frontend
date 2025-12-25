"use client";

import { format } from "date-fns";
import { Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface SettlementDetailData {
  id: string;
  nickname: string;
  nicknameId: string;
  phone: string;
  email: string;
  settlementDate: Date;
  lastUpdated: Date;
  settlementAmount: number;
  paymentAmount: number;
  paymentCount: number;
  deliveryCount: number;
  commission: number;
  refundCancelAmount: number;
  refundCancelCount: number;
  deliveryFee: number;
}

interface SettlementInfoCardProps {
  settlement: SettlementDetailData;
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
    <section className="w-full space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="font-semibold">
            {settlement.nickname} ({settlement.nicknameId})
          </span>
          <span>{settlement.phone}</span>
          <span>{settlement.email}</span>
        </div>

        <Popover open={isDatePickerOpen} onOpenChange={onDatePickerOpenChange}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="justify-start text-left font-normal">
              <Calendar className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "yyyy년 MM월 dd일 EEEE") : "날짜 선택"}
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

      <div className="text-sm text-gray-600">
        최종 업데이트 일시 : {format(settlement.lastUpdated, "yyyy-MM-dd HH:mm")}
      </div>

      <div className="flex items-center justify-between">
        <div className="basis-2/5 space-y-2">
          <div className="text-sm font-medium text-gray-600">정산 금액</div>
          <div className="text-2xl font-bold">{settlement.settlementAmount.toLocaleString()} 원</div>
        </div>

        <div className="grid basis-3/5 grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-gray-600">결제 금액</span>
              <Button variant="link" className="h-auto p-0 font-semibold" onClick={onPaymentBreakdownClick}>
                {settlement.paymentAmount.toLocaleString()}원
              </Button>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-gray-600">결제건수</span>
              <span className="font-semibold">{settlement.paymentCount}건</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-gray-600">배달건</span>
              <span className="font-semibold">{settlement.deliveryCount}건</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-gray-600">수수료</span>
              <span className="font-semibold">{settlement.commission.toLocaleString()}원</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-gray-600">환불 | 취소 금액</span>
              <span className="font-semibold">{settlement.refundCancelAmount.toLocaleString()}원</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-gray-600">환불 | 취소 건수</span>
              <span className="font-semibold">{settlement.refundCancelCount}건</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-gray-600">배달료</span>
              <span className="font-semibold">{settlement.deliveryFee.toLocaleString()}원</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-gray-600">정산금액</span>
              <span className="font-semibold">{settlement.settlementAmount.toLocaleString()}원</span>
            </div>
          </div>
        </div>
      </div>

      <hr />
    </section>
  );
}
