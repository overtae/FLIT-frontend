"use client";

import { useState } from "react";

import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface QuarterDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  year: string;
}

const categories = ["꽃", "식물", "화환", "공간연출", "정기배송"];

const paymentBreakdown = {
  card: 1500000000,
  transfer: 500000000,
  pos: 800000000,
};

export function QuarterDetailModal({ open, onOpenChange, year }: QuarterDetailModalProps) {
  const [selectedCategory, setSelectedCategory] = useState("꽃");
  const totalAmount = 1361471840;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{year} 상품 총 매출</DialogTitle>
            <RadioGroup value={selectedCategory} onValueChange={setSelectedCategory}>
              <div className="flex items-center gap-4">
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <RadioGroupItem value={category} id={category} />
                    <Label htmlFor={category} className="cursor-pointer font-normal">
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* 업데이트 일시 */}
          <div className="text-muted-foreground text-sm">
            최종 업데이트 일시 : {format(new Date(), "yyyy-MM-dd HH:mm")}
          </div>

          {/* 요약 정보 */}
          <div className="space-y-4">
            <div className="text-3xl font-bold">{totalAmount.toLocaleString()} 원</div>
            <div className="grid grid-cols-4 gap-4">
              <div className="border-border bg-background rounded-lg border p-4">
                <div className="text-muted-foreground text-sm">결제금액</div>
                <div className="text-lg font-semibold">{(totalAmount * 0.9).toLocaleString()}원</div>
              </div>
              <div className="border-border bg-background rounded-lg border p-4">
                <div className="text-muted-foreground text-sm">결제건수</div>
                <div className="text-lg font-semibold">1,250건</div>
              </div>
              <div className="border-border bg-background rounded-lg border p-4">
                <div className="text-muted-foreground text-sm">환불(취소) 금액</div>
                <div className="text-lg font-semibold">{(totalAmount * 0.1).toLocaleString()}원</div>
              </div>
              <div className="border-border bg-background rounded-lg border p-4">
                <div className="text-muted-foreground text-sm">환불(취소) 건수</div>
                <div className="text-lg font-semibold">25건</div>
              </div>
            </div>
          </div>

          {/* 결제 수단별 상세 */}
          <div className="space-y-3">
            <h4 className="font-semibold">결제 수단별 상세</h4>
            <div className="space-y-2">
              <div className="border-border bg-background rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">카드결제</span>
                  <span className="text-lg font-semibold">{paymentBreakdown.card.toLocaleString()}원</span>
                </div>
              </div>
              <div className="border-border bg-background rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">계좌이체</span>
                  <span className="text-lg font-semibold">{paymentBreakdown.transfer.toLocaleString()}원</span>
                </div>
              </div>
              <div className="border-border bg-background rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">현장결제(POS)</span>
                  <span className="text-lg font-semibold">{paymentBreakdown.pos.toLocaleString()}원</span>
                </div>
              </div>
            </div>
          </div>

          {/* 닫기 버튼 */}
          <div className="flex justify-end pt-4">
            <Button onClick={() => onOpenChange(false)}>닫기</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
