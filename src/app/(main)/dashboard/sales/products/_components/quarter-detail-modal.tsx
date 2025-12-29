"use client";

import { useEffect, useState } from "react";

import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getProductNetQuarterDetail } from "@/service/sales.service";
import type { ProductNetQuarterDetailResponse } from "@/types/sales.type";

interface QuarterDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  year: string;
}

const categories = ["FLOWER", "PLANTS", "WREATH", "SCENOGRAPHY", "REGULAR_DELIVERY"];
const categoryLabels: Record<string, string> = {
  FLOWER: "꽃",
  PLANTS: "식물",
  WREATH: "화환",
  SCENOGRAPHY: "공간연출",
  REGULAR_DELIVERY: "정기배송",
};

export function QuarterDetailModal({ open, onOpenChange, year }: QuarterDetailModalProps) {
  const [dataMap, setDataMap] = useState<Map<string, ProductNetQuarterDetailResponse>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("FLOWER");

  useEffect(() => {
    if (!open) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await getProductNetQuarterDetail();
        const map = new Map<string, ProductNetQuarterDetailResponse>();
        result.forEach((item) => {
          map.set(item.category, item);
        });
        setDataMap(map);
        if (result.length > 0) {
          setSelectedCategory((prev) => (map.has(prev) ? prev : result[0].category));
        }
      } catch (error) {
        console.error("Failed to fetch quarter product detail data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [open]);

  const selectedData = dataMap.get(selectedCategory);

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] max-w-[90vw] min-w-4xl">
          <DialogTitle className="text-foreground text-lg font-bold">{year} 상품 총 매출</DialogTitle>
          <div>Loading...</div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!selectedData) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] max-w-[90vw] min-w-4xl">
          <DialogTitle className="text-foreground text-lg font-bold">{year} 상품 총 매출</DialogTitle>
          <div>데이터가 없습니다.</div>
        </DialogContent>
      </Dialog>
    );
  }

  const totalAmount = selectedData.totalSales;
  const paymentAmount =
    selectedData.paymentAmount.card + selectedData.paymentAmount.bankTransfer + selectedData.paymentAmount.pos;
  const paymentCount =
    selectedData.paymentCount.card + selectedData.paymentCount.bankTransfer + selectedData.paymentCount.pos;
  const refundCancelAmount =
    selectedData.refundCancelAmount.card +
    selectedData.refundCancelAmount.bankTransfer +
    selectedData.refundCancelAmount.pos;
  const refundCancelCount =
    selectedData.refundCancelCount.card +
    selectedData.refundCancelCount.bankTransfer +
    selectedData.refundCancelCount.pos;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-[90vw] min-w-4xl">
        <div className="flex items-center justify-between">
          <DialogTitle className="text-foreground text-lg font-bold">{year} 상품 총 매출</DialogTitle>
          <RadioGroup value={selectedCategory} onValueChange={setSelectedCategory}>
            <div className="flex items-center gap-4">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <RadioGroupItem value={category} id={category} />
                  <Label htmlFor={category} className="cursor-pointer font-normal">
                    {categoryLabels[category]}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        <hr />

        <div className="space-y-6">
          {/* 업데이트 시간 */}
          <div className="text-muted-foreground text-xs">
            최종 업데이트 일시 : {format(new Date(selectedData.lastUpdatedAt), "yyyy-MM-dd HH:mm")}
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
            </div>

            {/* 우측 그리드 */}
            <div className="grid grid-cols-2 space-y-3">
              <div className="text-secondary-foreground text-center text-sm">환불 | 취소 금액</div>
              <div className="text-foreground text-end text-sm">{refundCancelAmount.toLocaleString()}원</div>
              <div className="text-secondary-foreground text-center text-sm">환불 | 취소 건수</div>
              <div className="text-foreground text-end text-sm">{refundCancelCount}건</div>
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
