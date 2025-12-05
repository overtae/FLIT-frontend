"use client";

import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface YearlyDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  year: string;
}

const paymentBreakdown = {
  card: 1500000000,
  transfer: 500000000,
  pos: 800000000,
};

export function YearlyDetailModal({ open, onOpenChange, year }: YearlyDetailModalProps) {
  const totalAmount = 1361471840;
  const paymentAmount = 1200000000;
  const paymentCount = 1250;
  const deliveryInProgress = 50;
  const refundCancelAmount = 161471840;
  const refundCancelCount = 25;
  const deliveryCompleted = 1175;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="bg-primary h-3 w-3 rounded-full"></div>
            <DialogTitle className="text-foreground text-lg font-bold">{year} 총 순매출</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* 업데이트 시간 */}
          <div className="text-muted-foreground text-xs">
            최종 업데이트 일시 : {format(new Date(), "yyyy-MM-dd HH:mm")}
          </div>

          {/* 메인: 총 매출액 */}
          <div className="text-foreground text-3xl font-bold">{totalAmount.toLocaleString()} 원</div>

          {/* 중앙 및 우측 그리드 */}
          <div className="grid grid-cols-3 gap-4">
            {/* 중앙 그리드 */}
            <div className="col-span-2 space-y-4">
              <div className="border-border bg-background rounded-lg border p-4">
                <div className="text-secondary-foreground text-sm">결제금액</div>
                <div className="text-foreground text-lg font-semibold">{paymentAmount.toLocaleString()}원</div>
              </div>
              <div className="border-border bg-background rounded-lg border p-4">
                <div className="text-secondary-foreground text-sm">결제건수</div>
                <div className="text-foreground text-lg font-semibold">{paymentCount}건</div>
              </div>
              <div className="border-border bg-background rounded-lg border p-4">
                <div className="text-secondary-foreground text-sm">배송중</div>
                <div className="text-foreground text-lg font-semibold">{deliveryInProgress}건</div>
              </div>
            </div>

            {/* 우측 그리드 */}
            <div className="col-span-1 space-y-4">
              <div className="border-border bg-background rounded-lg border p-4">
                <div className="text-secondary-foreground text-sm">환불|취소 금액</div>
                <div className="text-foreground text-lg font-semibold">{refundCancelAmount.toLocaleString()}원</div>
              </div>
              <div className="border-border bg-background rounded-lg border p-4">
                <div className="text-secondary-foreground text-sm">환불|취소 건수</div>
                <div className="text-foreground text-lg font-semibold">{refundCancelCount}건</div>
              </div>
              <div className="border-border bg-background rounded-lg border p-4">
                <div className="text-secondary-foreground text-sm">배송완료</div>
                <div className="text-foreground text-lg font-semibold">{deliveryCompleted}건</div>
              </div>
            </div>
          </div>

          {/* 우측 플로팅 박스 (상세 내역) */}
          <div className="flex justify-end">
            <div className="border-border bg-background w-[300px] space-y-3 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <span className="text-foreground font-medium">카드결제</span>
                <span className="text-foreground text-lg font-semibold">
                  {paymentBreakdown.card.toLocaleString()}원
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-foreground font-medium">계좌이체</span>
                <span className="text-foreground text-lg font-semibold">
                  {paymentBreakdown.transfer.toLocaleString()}원
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-foreground font-medium">현장결제(POS)</span>
                <span className="text-foreground text-lg font-semibold">{paymentBreakdown.pos.toLocaleString()}원</span>
              </div>
              <Button className="mt-4 w-full" onClick={() => onOpenChange(false)}>
                OK
              </Button>
            </div>
          </div>

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
