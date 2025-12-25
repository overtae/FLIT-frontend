"use client";

import { useEffect, useState } from "react";

import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { getYearlyRevenueDetailData, YearlyRevenueDetailData } from "@/lib/api/dashboard";

interface YearlyDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  year: string;
}

export function YearlyDetailModal({ open, onOpenChange, year }: YearlyDetailModalProps) {
  const [data, setData] = useState<YearlyRevenueDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!open) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await getYearlyRevenueDetailData(year);
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
        <DialogContent className="max-h-[90vh] max-w-[90vw] min-w-4xl">
          <div>Loading...</div>
        </DialogContent>
      </Dialog>
    );
  }

  const {
    totalAmount,
    paymentAmount,
    paymentCount,
    deliveryInProgress,
    refundCancelAmount,
    refundCancelCount,
    deliveryCompleted,
  } = data;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-[90vw] min-w-4xl">
        <DialogTitle className="text-foreground text-lg font-bold">{year} 총 순매출</DialogTitle>

        <hr />

        <div className="space-y-6">
          {/* 업데이트 시간 */}
          <div className="text-muted-foreground text-xs">
            최종 업데이트 일시 : {format(new Date(), "yyyy-MM-dd HH:mm")}
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* 메인: 총 매출액 */}
            <div className="text-foreground self-end pb-3 text-3xl font-medium">{totalAmount.toLocaleString()} 원</div>

            {/* 중앙 그리드 */}
            <div className="grid grid-cols-2 space-y-3">
              <div className="text-secondary-foreground text-center text-sm">결제금액</div>
              <div className="text-foreground text-end text-sm">{paymentAmount.toLocaleString()}원</div>
              <div className="text-secondary-foreground text-center text-sm">결제건수</div>
              <div className="text-foreground text-end text-sm">{paymentCount}건</div>
              <div className="text-secondary-foreground text-center text-sm">배송중</div>
              <div className="text-foreground text-end text-sm">{deliveryInProgress}건</div>
            </div>

            {/* 우측 그리드 */}
            <div className="grid grid-cols-2 space-y-3">
              <div className="text-secondary-foreground text-center text-sm">환불 | 취소 금액</div>
              <div className="text-foreground text-end text-sm">{refundCancelAmount.toLocaleString()}원</div>
              <div className="text-secondary-foreground text-center text-sm">환불 | 취소 건수</div>
              <div className="text-foreground text-end text-sm">{refundCancelCount}건</div>
              <div className="text-secondary-foreground text-center text-sm">배송완료</div>
              <div className="text-foreground text-end text-sm">{deliveryCompleted}건</div>
            </div>
          </div>

          <hr />

          {/* 최하단: 닫기 버튼 */}
          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              닫기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
