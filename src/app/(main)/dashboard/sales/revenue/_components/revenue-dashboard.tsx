"use client";

import { useEffect, useState } from "react";

import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getRevenueOverview } from "@/service/sales.service";
import type { RevenueOverviewResponse } from "@/types/sales.type";

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
  const [dashboardData, setDashboardData] = useState<RevenueOverviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const targetDate = selectedDate ? selectedDate.toISOString().split("T")[0] : undefined;
        const data = await getRevenueOverview(targetDate ? { targetDate } : undefined);
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

  const totalRevenue = dashboardData.totalSales;
  const paymentAmount =
    dashboardData.paymentAmount.card + dashboardData.paymentAmount.bankTransfer + dashboardData.paymentAmount.pos;
  const paymentCount =
    dashboardData.paymentCount.card + dashboardData.paymentCount.bankTransfer + dashboardData.paymentCount.pos;
  const deliveryInProgress = dashboardData.shippingCount;
  const refundCancelAmount =
    dashboardData.refundCancelAmount.card +
    dashboardData.refundCancelAmount.bankTransfer +
    dashboardData.refundCancelAmount.pos;
  const refundCancelCount =
    dashboardData.refundCancelCount.card +
    dashboardData.refundCancelCount.bankTransfer +
    dashboardData.refundCancelCount.pos;
  const deliveryCompleted = dashboardData.shippingCompletedCount;
  const paymentAmountBreakdown = {
    card: dashboardData.paymentAmount.card,
    transfer: dashboardData.paymentAmount.bankTransfer,
    pos: dashboardData.paymentAmount.pos,
  };
  const paymentCountBreakdown = {
    card: dashboardData.paymentCount.card,
    transfer: dashboardData.paymentCount.bankTransfer,
    pos: dashboardData.paymentCount.pos,
  };
  const refundCancelAmountBreakdown = {
    card: dashboardData.refundCancelAmount.card,
    transfer: dashboardData.refundCancelAmount.bankTransfer,
    pos: dashboardData.refundCancelAmount.pos,
  };
  const refundCancelCountBreakdown = {
    card: dashboardData.refundCancelCount.card,
    transfer: dashboardData.refundCancelCount.bankTransfer,
    pos: dashboardData.refundCancelCount.pos,
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-foreground text-lg font-bold sm:text-xl">매출현황</h2>
        <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left text-xs font-normal sm:w-[250px] sm:text-sm"
            >
              <span className="hidden sm:inline">
                {selectedDate ? format(selectedDate, "yyyy년 MM월 dd일 EEEE", { locale: ko }) : "날짜 선택"}
              </span>
              <span className="sm:hidden">{selectedDate ? format(selectedDate, "MM/dd") : "날짜 선택"}</span>
              <ChevronDown className="ml-auto h-3.5 w-3.5 opacity-50 sm:h-4 sm:w-4" />
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
      <div className="text-muted-foreground text-[10px] sm:text-xs">
        최종 업데이트 일시 : {format(new Date(dashboardData.lastUpdatedAt), "yyyy-MM-dd HH:mm")}
      </div>

      {/* 메인 지표 및 서브 지표 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
        {/* 좌측: 총 매출액 */}
        <div className="col-span-1 place-content-end sm:col-span-1">
          <div className="text-foreground text-2xl font-medium sm:text-3xl">{totalRevenue.toLocaleString()} 원</div>
        </div>

        {/* 우측: 서브 지표 2열 3행 그리드 */}
        <div className="col-span-1 grid grid-cols-1 gap-3 sm:col-span-2 sm:grid-cols-2 sm:gap-6">
          {/* 1열 */}
          <div className="flex flex-col gap-2">
            <TooltipProvider>
              <Tooltip open={isPaymentAmountTooltipOpen} onOpenChange={setIsPaymentAmountTooltipOpen}>
                <TooltipTrigger asChild>
                  <button
                    className="text-secondary-foreground hover:text-main cursor-pointer"
                    onClick={() => setIsPaymentAmountTooltipOpen(!isPaymentAmountTooltipOpen)}
                  >
                    <div className="flex items-center justify-between gap-2 sm:gap-4">
                      <div className="text-xs sm:text-sm">결제금액</div>
                      <div className="text-xs font-medium sm:text-sm">{paymentAmount.toLocaleString()}원</div>
                    </div>
                  </button>
                </TooltipTrigger>
                <TooltipContent className="text-foreground bg-card border-main min-w-[200px] rounded-lg border p-3 shadow-lg sm:min-w-64 sm:p-4">
                  <div className="flex flex-col items-center gap-2 sm:gap-3">
                    <div className="flex w-full items-center justify-between gap-2 sm:gap-4">
                      <div className="text-xs sm:text-sm">카드결제</div>
                      <div className="text-xs font-medium sm:text-sm">
                        {paymentAmountBreakdown.card.toLocaleString()}원
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-between gap-2 sm:gap-4">
                      <div className="text-xs sm:text-sm">계좌이체</div>
                      <div className="text-xs font-medium sm:text-sm">
                        {paymentAmountBreakdown.transfer.toLocaleString()}원
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-between gap-2 sm:gap-4">
                      <div className="text-xs sm:text-sm">현장결제(POS)</div>
                      <div className="text-xs font-medium sm:text-sm">
                        {paymentAmountBreakdown.pos.toLocaleString()}원
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="w-fit rounded-full px-4 text-xs sm:px-6 sm:text-sm"
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
                    <div className="flex items-center justify-between gap-2 sm:gap-4">
                      <div className="text-xs sm:text-sm">결제건수</div>
                      <div className="text-xs font-medium sm:text-sm">{paymentCount}건</div>
                    </div>
                  </button>
                </TooltipTrigger>
                <TooltipContent className="text-foreground bg-card border-main min-w-[200px] rounded-lg border p-3 shadow-lg sm:min-w-64 sm:p-4">
                  <div className="flex flex-col items-center gap-2 sm:gap-3">
                    <div className="flex w-full items-center justify-between gap-2 sm:gap-4">
                      <div className="text-xs sm:text-sm">카드결제</div>
                      <div className="text-xs font-medium sm:text-sm">{paymentCountBreakdown.card}건</div>
                    </div>
                    <div className="flex w-full items-center justify-between gap-2 sm:gap-4">
                      <div className="text-xs sm:text-sm">계좌이체</div>
                      <div className="text-xs font-medium sm:text-sm">{paymentCountBreakdown.transfer}건</div>
                    </div>
                    <div className="flex w-full items-center justify-between gap-2 sm:gap-4">
                      <div className="text-xs sm:text-sm">현장결제(POS)</div>
                      <div className="text-xs font-medium sm:text-sm">{paymentCountBreakdown.pos}건</div>
                    </div>
                    <Button
                      size="sm"
                      className="w-fit rounded-full px-4 text-xs sm:px-6 sm:text-sm"
                      onClick={() => setIsPaymentCountTooltipOpen(false)}
                    >
                      OK
                    </Button>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              <div className="text-secondary-foreground text-xs sm:text-sm">배송중</div>
              <div className="text-foreground text-xs font-medium sm:text-sm">{deliveryInProgress}건</div>
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
                    <div className="flex w-full items-center justify-between gap-2 sm:gap-4">
                      <div className="text-xs sm:text-sm">환불 | 취소 금액</div>
                      <div className="text-xs font-medium sm:text-sm">{refundCancelAmount.toLocaleString()}원</div>
                    </div>
                  </button>
                </TooltipTrigger>
                <TooltipContent className="text-foreground bg-card border-main min-w-[200px] rounded-lg border p-3 shadow-lg sm:min-w-64 sm:p-4">
                  <div className="flex flex-col items-center gap-2 sm:gap-3">
                    <div className="flex w-full items-center justify-between gap-2 sm:gap-4">
                      <div className="text-xs sm:text-sm">카드결제</div>
                      <div className="text-xs font-medium sm:text-sm">
                        {refundCancelAmountBreakdown.card.toLocaleString()}원
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-between gap-2 sm:gap-4">
                      <div className="text-xs sm:text-sm">계좌이체</div>
                      <div className="text-xs font-medium sm:text-sm">
                        {refundCancelAmountBreakdown.transfer.toLocaleString()}원
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-between gap-2 sm:gap-4">
                      <div className="text-xs sm:text-sm">현장결제(POS)</div>
                      <div className="text-xs font-medium sm:text-sm">
                        {refundCancelAmountBreakdown.pos.toLocaleString()}원
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="w-fit rounded-full px-4 text-xs sm:px-6 sm:text-sm"
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
                    <div className="flex items-center justify-between gap-2 sm:gap-4">
                      <div className="text-xs sm:text-sm">환불 | 취소 건수</div>
                      <div className="text-xs font-medium sm:text-sm">{refundCancelCount}건</div>
                    </div>
                  </button>
                </TooltipTrigger>
                <TooltipContent className="text-foreground bg-card border-main min-w-[200px] rounded-lg border p-3 shadow-lg sm:min-w-64 sm:p-4">
                  <div className="flex flex-col items-center gap-2 sm:gap-3">
                    <div className="flex w-full items-center justify-between gap-2 sm:gap-4">
                      <div className="text-xs sm:text-sm">카드결제</div>
                      <div className="text-xs font-medium sm:text-sm">{refundCancelCountBreakdown.card}건</div>
                    </div>
                    <div className="flex w-full items-center justify-between gap-2 sm:gap-4">
                      <div className="text-xs sm:text-sm">계좌이체</div>
                      <div className="text-xs font-medium sm:text-sm">{refundCancelCountBreakdown.transfer}건</div>
                    </div>
                    <div className="flex w-full items-center justify-between gap-2 sm:gap-4">
                      <div className="text-xs sm:text-sm">현장결제(POS)</div>
                      <div className="text-xs font-medium sm:text-sm">{refundCancelCountBreakdown.pos}건</div>
                    </div>
                    <Button
                      size="sm"
                      className="w-fit rounded-full px-4 text-xs sm:px-6 sm:text-sm"
                      onClick={() => setIsRefundCancelCountTooltipOpen(false)}
                    >
                      OK
                    </Button>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="flex w-full items-center justify-between gap-2 sm:gap-4">
              <div className="text-secondary-foreground text-xs sm:text-sm">배송완료</div>
              <div className="text-foreground text-xs font-medium sm:text-sm">{deliveryCompleted}건</div>
            </div>
          </div>
        </div>
      </div>
      <hr />
    </div>
  );
}
