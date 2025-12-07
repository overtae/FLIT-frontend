"use client";

import { useState } from "react";

import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RevenueDashboardProps {
  selectedDate?: Date;
  onDateSelect: (date: Date | undefined) => void;
}

const paymentBreakdown = {
  card: 150,
  transfer: 80,
  pos: 120,
};

export function RevenueDashboard({ selectedDate, onDateSelect }: RevenueDashboardProps) {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isPaymentTooltipOpen, setIsPaymentTooltipOpen] = useState(false);
  const [isRefundAmountTooltipOpen, setIsRefundAmountTooltipOpen] = useState(false);
  const [isRefundCountTooltipOpen, setIsRefundCountTooltipOpen] = useState(false);

  const totalRevenue = 32430000;
  const paymentAmount = 30000000;
  const paymentCount = 350;
  const deliveryInProgress = 25;
  const refundCancelAmount = 2430000;
  const refundCancelCount = 15;
  const deliveryCompleted = 310;

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="text-foreground text-xl font-bold">매출현황</h2>
        <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[250px] justify-start text-left font-normal">
              {selectedDate ? format(selectedDate, "yyyy년 MM월 dd일 EEEE", { locale: ko }) : "날짜 선택"}
              <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                onDateSelect(date);
                setIsDatePickerOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* 최종 업데이트 일시 */}
      <div className="text-muted-foreground text-xs">최종 업데이트 일시 : {format(new Date(), "yyyy-MM-dd HH:mm")}</div>

      {/* 메인 지표 및 서브 지표 */}
      <div className="grid grid-cols-3 gap-6">
        {/* 좌측: 총 매출액 */}
        <div className="col-span-1">
          <div className="text-foreground text-4xl font-bold">{totalRevenue.toLocaleString()} 원</div>
        </div>

        {/* 우측: 서브 지표 2열 3행 그리드 */}
        <div className="col-span-2 grid grid-cols-2 gap-6">
          {/* 1열 */}
          <div className="flex flex-col items-start justify-start gap-2">
            <div className="text-secondary-foreground text-sm">
              결제금액 <span className="text-foreground font-semibold">{paymentAmount.toLocaleString()}원</span>
            </div>
            <TooltipProvider>
              <Tooltip open={isPaymentTooltipOpen} onOpenChange={setIsPaymentTooltipOpen}>
                <TooltipTrigger asChild>
                  <button
                    className="text-primary cursor-pointer text-sm hover:underline"
                    onClick={() => setIsPaymentTooltipOpen(!isPaymentTooltipOpen)}
                  >
                    결제건수 {paymentCount}건
                  </button>
                </TooltipTrigger>
                <TooltipContent className="text-foreground bg-card border-border rounded-lg border p-4 shadow-lg">
                  <div className="space-y-2">
                    <div className="text-sm">카드결제 {paymentBreakdown.card}건</div>
                    <div className="text-sm">계좌이체 {paymentBreakdown.transfer}건</div>
                    <div className="text-sm">현장결제(POS) {paymentBreakdown.pos}건</div>
                    <Button
                      size="sm"
                      className="mt-2 w-full rounded-full"
                      onClick={() => setIsPaymentTooltipOpen(false)}
                    >
                      OK
                    </Button>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="text-secondary-foreground text-sm">
              배송중 <span className="text-foreground font-semibold">{deliveryInProgress}건</span>
            </div>
          </div>

          {/* 2열 */}
          <div className="flex flex-col items-start justify-start gap-2">
            <TooltipProvider>
              <Tooltip open={isRefundAmountTooltipOpen} onOpenChange={setIsRefundAmountTooltipOpen}>
                <TooltipTrigger asChild>
                  <button
                    className="text-secondary-foreground cursor-pointer text-sm hover:underline"
                    onClick={() => setIsRefundAmountTooltipOpen(!isRefundAmountTooltipOpen)}
                  >
                    환불 | 취소 금액{" "}
                    <span className="text-primary font-semibold">{refundCancelAmount.toLocaleString()}원</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent className="text-foreground bg-card border-border rounded-lg border p-4 shadow-lg">
                  <div className="space-y-2">
                    <div className="text-sm">환불 | 취소 금액 상세 정보</div>
                    <Button
                      size="sm"
                      className="mt-2 w-full rounded-full"
                      onClick={() => setIsRefundAmountTooltipOpen(false)}
                    >
                      OK
                    </Button>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip open={isRefundCountTooltipOpen} onOpenChange={setIsRefundCountTooltipOpen}>
                <TooltipTrigger asChild>
                  <button
                    className="text-secondary-foreground cursor-pointer text-sm hover:underline"
                    onClick={() => setIsRefundCountTooltipOpen(!isRefundCountTooltipOpen)}
                  >
                    환불 | 취소 건수 <span className="text-primary font-semibold">{refundCancelCount}건</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent className="text-foreground bg-card border-border rounded-lg border p-4 shadow-lg">
                  <div className="space-y-2">
                    <div className="text-sm">환불 | 취소 건수 상세 정보</div>
                    <Button
                      size="sm"
                      className="mt-2 w-full rounded-full"
                      onClick={() => setIsRefundCountTooltipOpen(false)}
                    >
                      OK
                    </Button>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="text-secondary-foreground text-sm">
              배송완료 <span className="text-foreground font-semibold">{deliveryCompleted}건</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
