"use client";

import { useMemo } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SERVICE_CONFIG } from "@/config/service-config";
import type { TransactionDetail } from "@/types/transaction.type";

interface TransactionDetailDeliveryInfoProps {
  transaction: TransactionDetail;
  category: "order" | "order-request" | "canceled";
  totalAgencyFee?: number;
}

function DeliveryStatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-4">
      <Label className="text-muted-foreground w-24 shrink-0 text-xs font-normal">{label}</Label>
      <Input value={value} readOnly className="pointer-events-none h-9 border-gray-200 bg-gray-50 text-left text-sm" />
    </div>
  );
}

function DeliveryTypeInput({ type, totalAgencyFee }: { type: string; totalAgencyFee?: number }) {
  const typeLabel = SERVICE_CONFIG.transactionType[type as keyof typeof SERVICE_CONFIG.transactionType] ?? type;
  return (
    <div className="flex items-center gap-4">
      <Label className="text-muted-foreground w-24 shrink-0 text-xs font-normal">구분</Label>
      <div className="relative flex-1">
        <Input
          value={typeLabel}
          readOnly
          className="pointer-events-none h-9 border-gray-200 bg-gray-50 pr-32 text-left text-sm"
        />
        {type === "BAROGO" && totalAgencyFee && (
          <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-gray-600">
            대행료 합계 {totalAgencyFee.toLocaleString()}원
          </span>
        )}
      </div>
    </div>
  );
}

function DeliveryCostDetail({ deliveryInfo }: { deliveryInfo: NonNullable<TransactionDetail["deliveryInformation"]> }) {
  const estimatedTime = useMemo(() => {
    if (!deliveryInfo.deliveryDate) return null;

    const deliveryDate = new Date(deliveryInfo.deliveryDate);
    const now = new Date();
    const diffMs = deliveryDate.getTime() - now.getTime();

    if (diffMs <= 0) return null;

    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays}일 ${diffHours % 24}시간 후`;
    }
    if (diffHours > 0) {
      return `${diffHours}시간 ${diffMinutes % 60}분 후`;
    }
    return `${diffMinutes}분 후`;
  }, [deliveryInfo.deliveryDate]);

  return (
    <div className="flex flex-col gap-2">
      <div className="ml-28 space-y-2 rounded-md border border-gray-200 bg-gray-50 p-3">
        {deliveryInfo.deliveryDistance && deliveryInfo.distanceDeliveryAmount && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">거리 비례 대행료 (거리{deliveryInfo.deliveryDistance}km)</span>
            <span className="font-medium">{deliveryInfo.distanceDeliveryAmount.toLocaleString()}원</span>
          </div>
        )}
        {deliveryInfo.rainSurcharge && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">우천 할증</span>
            <span className="font-medium">{deliveryInfo.rainSurcharge.toLocaleString()}원</span>
          </div>
        )}
        {deliveryInfo.vat && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">부가세</span>
            <span className="font-medium">{deliveryInfo.vat.toLocaleString()}원</span>
          </div>
        )}
      </div>
      {estimatedTime && (
        <div className="text-right text-sm">
          <span className="font-medium text-blue-600">{estimatedTime}</span>
          배달 예상
        </div>
      )}
    </div>
  );
}

export function TransactionDetailDeliveryInfo({
  transaction,
  category,
  totalAgencyFee,
}: TransactionDetailDeliveryInfoProps) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold">배달정보</h3>
      <div className="space-y-4">
        <DeliveryStatusRow
          label="상태"
          value={
            category === "canceled"
              ? SERVICE_CONFIG.refundStatus[transaction.deliveryStatus as keyof typeof SERVICE_CONFIG.refundStatus]
              : SERVICE_CONFIG.deliveryStatus[transaction.deliveryStatus as keyof typeof SERVICE_CONFIG.deliveryStatus]
          }
        />

        {category === "order" ? (
          <div className="space-y-2">
            <DeliveryTypeInput type={transaction.type} totalAgencyFee={totalAgencyFee} />
            {transaction.type === "BAROGO" && transaction.deliveryInformation && (
              <DeliveryCostDetail deliveryInfo={transaction.deliveryInformation} />
            )}
          </div>
        ) : category !== "canceled" ? (
          <DeliveryStatusRow
            label="구분"
            value={
              SERVICE_CONFIG.transactionType[transaction.type as keyof typeof SERVICE_CONFIG.transactionType] ??
              transaction.type
            }
          />
        ) : null}
      </div>
    </div>
  );
}
