"use client";

import { useEffect, useState } from "react";

import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { getRevenueNetQuarterDetail } from "@/service/sales.service";
import type { RevenueOverviewResponse } from "@/types/sales.type";

interface YearlyDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  year: string;
}

export function YearlyDetailModal({ open, onOpenChange, year }: YearlyDetailModalProps) {
  const [data, setData] = useState<RevenueOverviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!open) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await getRevenueNetQuarterDetail();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch yearly revenue detail data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [open, year]);

  if (isLoading || !data) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] w-[95vw] max-w-4xl p-4 sm:p-6">
          <div>Loading...</div>
        </DialogContent>
      </Dialog>
    );
  }

  const totalAmount = data.totalSales;
  const paymentAmount = data.paymentAmount.card + data.paymentAmount.bankTransfer + data.paymentAmount.pos;
  const paymentCount = data.paymentCount.card + data.paymentCount.bankTransfer + data.paymentCount.pos;
  const deliveryInProgress = data.shippingCount;
  const refundCancelAmount =
    data.refundCancelAmount.card + data.refundCancelAmount.bankTransfer + data.refundCancelAmount.pos;
  const refundCancelCount =
    data.refundCancelCount.card + data.refundCancelCount.bankTransfer + data.refundCancelCount.pos;
  const deliveryCompleted = data.shippingCompletedCount;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[95vw] max-w-4xl p-4 sm:p-6">
        <DialogTitle className="text-foreground text-base font-bold sm:text-lg">{year} 총 순매출</DialogTitle>

        <hr className="my-3 sm:my-4" />

        <div className="space-y-4 sm:space-y-6">
          {/* 업데이트 시간 */}
          <div className="text-muted-foreground text-xs">
            최종 업데이트 일시 : {format(new Date(), "yyyy-MM-dd HH:mm")}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
            {/* 메인: 총 매출액 */}
            <div className="text-foreground self-start pb-0 text-xl font-medium sm:self-end sm:pb-3 sm:text-3xl">
              {totalAmount.toLocaleString()} 원
            </div>

            {/* 중앙 그리드 */}
            <div className="grid grid-cols-2 gap-2 sm:space-y-3">
              <div className="text-secondary-foreground text-center text-xs sm:text-sm">결제금액</div>
              <div className="text-foreground text-end text-xs sm:text-sm">{paymentAmount.toLocaleString()}원</div>
              <div className="text-secondary-foreground text-center text-xs sm:text-sm">결제건수</div>
              <div className="text-foreground text-end text-xs sm:text-sm">{paymentCount}건</div>
              <div className="text-secondary-foreground text-center text-xs sm:text-sm">배송중</div>
              <div className="text-foreground text-end text-xs sm:text-sm">{deliveryInProgress}건</div>
            </div>

            {/* 우측 그리드 */}
            <div className="grid grid-cols-2 gap-2 sm:space-y-3">
              <div className="text-secondary-foreground text-center text-xs sm:text-sm">환불 | 취소 금액</div>
              <div className="text-foreground text-end text-xs sm:text-sm">{refundCancelAmount.toLocaleString()}원</div>
              <div className="text-secondary-foreground text-center text-xs sm:text-sm">환불 | 취소 건수</div>
              <div className="text-foreground text-end text-xs sm:text-sm">{refundCancelCount}건</div>
              <div className="text-secondary-foreground text-center text-xs sm:text-sm">배송완료</div>
              <div className="text-foreground text-end text-xs sm:text-sm">{deliveryCompleted}건</div>
            </div>
          </div>

          <hr className="my-3 sm:my-4" />

          {/* 최하단: 닫기 버튼 */}
          <div className="flex justify-end pt-3 sm:pt-4">
            <Button variant="outline" className="text-xs sm:text-sm" onClick={() => onOpenChange(false)}>
              닫기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
