"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { SERVICE_CONFIG } from "@/config/service-config";
import type { TransactionDetail } from "@/types/transaction.type";

interface TransactionDetailPurchaseInfoProps {
  transaction: TransactionDetail;
  category: "order" | "order-request" | "canceled";
}

export function TransactionDetailPurchaseInfo({ transaction, category }: TransactionDetailPurchaseInfoProps) {
  const paymentMethodOptions = ["카드", "계좌이체", "POS 결제"] as const;
  const getPaymentMethodValue = (method: string): "카드" | "계좌이체" | "POS 결제" => {
    const methodLabel = SERVICE_CONFIG.paymentMethod[method as keyof typeof SERVICE_CONFIG.paymentMethod] ?? method;
    if (methodLabel === "카드" || methodLabel === "플릿결제") return "카드";
    if (methodLabel === "계좌이체") return "계좌이체";
    return "POS 결제";
  };
  const selectedPaymentMethod = getPaymentMethodValue(transaction.paymentMethod ?? "CARD");

  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold">구매내역</h3>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Label className="text-muted-foreground w-24 shrink-0 text-xs font-normal">주문번호</Label>
          <Input
            value={transaction.transactionNumber}
            readOnly
            className="pointer-events-none h-9 border-gray-200 bg-gray-50 text-left text-sm"
          />
        </div>
        <div className="flex items-center gap-4">
          <Label className="text-muted-foreground w-24 shrink-0 text-xs font-normal">상품명</Label>
          <Input
            value={transaction.productName}
            readOnly
            className="pointer-events-none h-9 border-gray-200 bg-gray-50 text-left text-sm"
          />
        </div>
        <div className="flex items-center gap-4">
          <Label className="text-muted-foreground w-24 shrink-0 text-xs font-normal">가격</Label>
          <Input
            value={`${transaction.paymentAmount.toLocaleString()}원`}
            readOnly
            className="pointer-events-none h-9 border-gray-200 bg-gray-50 text-left text-sm"
          />
        </div>
        {category !== "canceled" && (
          <div className="flex items-start gap-4">
            <Label className="text-muted-foreground w-24 shrink-0 pt-2 text-xs font-normal">결제방법</Label>
            <div className="flex-1">
              <ToggleGroup
                type="single"
                variant="outline"
                spacing={1}
                value={selectedPaymentMethod}
                className="flex gap-2"
              >
                {paymentMethodOptions.map((option) => (
                  <ToggleGroupItem
                    key={option}
                    value={option}
                    className={`bg-background! pointer-events-none shadow-none ${selectedPaymentMethod === option ? "border-main text-primary!" : ""}`}
                  >
                    {option}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          </div>
        )}
        <div className="flex items-center gap-4">
          <Label className="text-muted-foreground w-24 shrink-0 text-xs font-normal">적립금</Label>
          <Input
            value={`${transaction.reserve.toLocaleString()}원`}
            readOnly
            className="pointer-events-none h-9 border-gray-200 bg-gray-50 text-left text-sm"
          />
        </div>
        <div className="flex items-start gap-4">
          <Label className="text-muted-foreground w-24 shrink-0 pt-2 text-xs font-normal">고객 요청 사항</Label>
          <Textarea
            value={transaction.customerRequest ?? ""}
            readOnly
            rows={3}
            className="pointer-events-none resize-none border-gray-200 bg-gray-50 text-left text-sm"
          />
        </div>
      </div>
    </div>
  );
}
