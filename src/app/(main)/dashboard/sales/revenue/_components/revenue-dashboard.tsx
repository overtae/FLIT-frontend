"use client";

import { useEffect, useState } from "react";

import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getRevenueDashboardData, RevenueDashboardData } from "@/lib/api/dashboard";

interface RevenueDashboardProps {
  selectedDate?: Date;
  onDateSelect: (date: Date | undefined) => void;
}

export function RevenueDashboard({ selectedDate, onDateSelect }: RevenueDashboardProps) {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isPaymentCountTooltipOpen, setIsPaymentCountTooltipOpen] = useState(false);
  const [isPaymentAmountTooltipOpen, setIsPaymentAmountTooltipOpen] = useState(false);
  const [isRefundCancelAmountTooltipOpen, setIsRefundCancelAmountTooltipOpen] = useState(false);
  const [isRefundCancelCountTooltipOpen, setIsRefundCancelCountTooltipOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState<RevenueDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getRevenueDashboardData(selectedDate);
        setDashboardData(data);
      } catch (error) {
        console.error("Failed to fetch revenue dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedDate]);

  if (isLoading || !dashboardData) {
    return <div>Loading...</div>;
  }

  const {
    totalRevenue,
    paymentAmount,
    paymentCount,
    deliveryInProgress,
    refundCancelAmount,
    refundCancelCount,
    deliveryCompleted,
    paymentCountBreakdown,
    paymentAmountBreakdown,
    refundCancelCountBreakdown,
    refundCancelAmountBreakdown,
  } = dashboardData;

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

      <hr />

      {/* 최종 업데이트 일시 */}
      <div className="text-muted-foreground text-xs">최종 업데이트 일시 : {format(new Date(), "yyyy-MM-dd HH:mm")}</div>

      {/* 메인 지표 및 서브 지표 */}
      <div className="grid grid-cols-3 gap-6">
        {/* 좌측: 총 매출액 */}
        <div className="col-span-1 place-content-end">
          <div className="text-foreground text-3xl font-medium">{totalRevenue.toLocaleString()} 원</div>
        </div>

        {/* 우측: 서브 지표 2열 3행 그리드 */}
        <div className="col-span-2 grid grid-cols-2 gap-6">
          {/* 1열 */}
          <div className="flex flex-col gap-2">
            <TooltipProvider>
              <Tooltip open={isPaymentAmountTooltipOpen} onOpenChange={setIsPaymentAmountTooltipOpen}>
                <TooltipTrigger asChild>
                  <button
                    className="text-secondary-foreground hover:text-main cursor-pointer"
                    onClick={() => setIsPaymentAmountTooltipOpen(!isPaymentAmountTooltipOpen)}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="text-sm">결제금액</div>
                      <div className="font-medium">{paymentAmount.toLocaleString()}원</div>
                    </div>
                  </button>
                </TooltipTrigger>
                <TooltipContent className="text-foreground bg-card border-main min-w-64 rounded-lg border p-4 shadow-lg">
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex w-full items-center justify-between gap-4">
                      <div className="text-sm">카드결제</div>
                      <div className="text-sm font-medium">{paymentAmountBreakdown.card.toLocaleString()}원</div>
                    </div>
                    <div className="flex w-full items-center justify-between gap-4">
                      <div className="text-sm">계좌이체</div>
                      <div className="text-sm font-medium">{paymentAmountBreakdown.transfer.toLocaleString()}원</div>
                    </div>
                    <div className="flex w-full items-center justify-between gap-4">
                      <div className="text-sm">현장결제(POS)</div>
                      <div className="text-sm font-medium">{paymentAmountBreakdown.pos.toLocaleString()}원</div>
                    </div>
                    <Button
                      size="sm"
                      className="w-fit rounded-full px-6 text-sm"
                      onClick={() => setIsPaymentAmountTooltipOpen(false)}
                    >
                      OK
                    </Button>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip open={isPaymentCountTooltipOpen} onOpenChange={setIsPaymentCountTooltipOpen}>
                <TooltipTrigger asChild>
                  <button
                    className="text-foreground hover:text-main cursor-pointer"
                    onClick={() => setIsPaymentCountTooltipOpen(!isPaymentCountTooltipOpen)}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="text-sm">결제건수</div>
                      <div className="font-medium">{paymentCount}건</div>
                    </div>
                  </button>
                </TooltipTrigger>
                <TooltipContent className="text-foreground bg-card border-main min-w-64 rounded-lg border p-4 shadow-lg">
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex w-full items-center justify-between gap-4">
                      <div className="text-sm">카드결제</div>
                      <div className="text-sm font-medium">{paymentCountBreakdown.card}건</div>
                    </div>
                    <div className="flex w-full items-center justify-between gap-4">
                      <div className="text-sm">계좌이체</div>
                      <div className="text-sm font-medium">{paymentCountBreakdown.transfer}건</div>
                    </div>
                    <div className="flex w-full items-center justify-between gap-4">
                      <div className="text-sm">현장결제(POS)</div>
                      <div className="text-sm font-medium">{paymentCountBreakdown.pos}건</div>
                    </div>
                    <Button
                      size="sm"
                      className="w-fit rounded-full px-6 text-sm"
                      onClick={() => setIsPaymentCountTooltipOpen(false)}
                    >
                      OK
                    </Button>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="flex items-center justify-between gap-4">
              <div className="text-secondary-foreground text-sm">배송중</div>
              <div className="text-foreground font-medium">{deliveryInProgress}건</div>
            </div>
          </div>

          {/* 2열 */}
          <div className="flex flex-col items-start justify-start gap-2">
            <TooltipProvider>
              <Tooltip open={isRefundCancelAmountTooltipOpen} onOpenChange={setIsRefundCancelAmountTooltipOpen}>
                <TooltipTrigger asChild>
                  <button
                    className="text-secondary-foreground hover:text-main w-full cursor-pointer"
                    onClick={() => setIsRefundCancelAmountTooltipOpen(!isRefundCancelAmountTooltipOpen)}
                  >
                    <div className="flex w-full items-center justify-between gap-4">
                      <div className="text-sm">환불 | 취소 금액</div>
                      <div className="font-medium">{refundCancelAmount.toLocaleString()}원</div>
                    </div>
                  </button>
                </TooltipTrigger>
                <TooltipContent className="text-foreground bg-card border-main min-w-64 rounded-lg border p-4 shadow-lg">
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex w-full items-center justify-between gap-4">
                      <div className="text-sm">카드결제</div>
                      <div className="text-sm font-medium">{refundCancelAmountBreakdown.card.toLocaleString()}원</div>
                    </div>
                    <div className="flex w-full items-center justify-between gap-4">
                      <div className="text-sm">계좌이체</div>
                      <div className="text-sm font-medium">
                        {refundCancelAmountBreakdown.transfer.toLocaleString()}원
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-between gap-4">
                      <div className="text-sm">현장결제(POS)</div>
                      <div className="text-sm font-medium">{refundCancelAmountBreakdown.pos.toLocaleString()}원</div>
                    </div>
                    <Button
                      size="sm"
                      className="w-fit rounded-full px-6 text-sm"
                      onClick={() => setIsRefundCancelAmountTooltipOpen(false)}
                    >
                      OK
                    </Button>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip open={isRefundCancelCountTooltipOpen} onOpenChange={setIsRefundCancelCountTooltipOpen}>
                <TooltipTrigger asChild>
                  <button
                    className="text-secondary-foreground hover:text-main w-full cursor-pointer"
                    onClick={() => setIsRefundCancelCountTooltipOpen(!isRefundCancelCountTooltipOpen)}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="text-sm">환불 | 취소 건수</div>
                      <div className="font-medium">{refundCancelCount}건</div>
                    </div>
                  </button>
                </TooltipTrigger>
                <TooltipContent className="text-foreground bg-card border-main min-w-64 rounded-lg border p-4 shadow-lg">
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex w-full items-center justify-between gap-4">
                      <div className="text-sm">카드결제</div>
                      <div className="text-sm font-medium">{refundCancelCountBreakdown.card}건</div>
                    </div>
                    <div className="flex w-full items-center justify-between gap-4">
                      <div className="text-sm">계좌이체</div>
                      <div className="text-sm font-medium">{refundCancelCountBreakdown.transfer}건</div>
                    </div>
                    <div className="flex w-full items-center justify-between gap-4">
                      <div className="text-sm">현장결제(POS)</div>
                      <div className="text-sm font-medium">{refundCancelCountBreakdown.pos}건</div>
                    </div>
                    <Button
                      size="sm"
                      className="w-fit rounded-full px-6 text-sm"
                      onClick={() => setIsRefundCancelCountTooltipOpen(false)}
                    >
                      OK
                    </Button>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="flex w-full items-center justify-between gap-4">
              <div className="text-secondary-foreground text-sm">배송완료</div>
              <div className="text-foreground font-medium">{deliveryCompleted}건</div>
            </div>
          </div>
        </div>
      </div>
      <hr />
    </div>
  );
}
