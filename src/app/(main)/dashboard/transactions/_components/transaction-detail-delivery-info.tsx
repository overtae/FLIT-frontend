"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Transaction } from "./transaction-types";

interface TransactionDetailDeliveryInfoProps {
  transaction: Transaction;
  category: "order" | "order-request" | "canceled";
  totalAgencyFee?: number;
  estimatedTimeHighlight?: string;
  estimatedTimeRest?: string;
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
  return (
    <div className="flex items-center gap-4">
      <Label className="text-muted-foreground w-24 shrink-0 text-xs font-normal">구분</Label>
      <div className="relative flex-1">
        <Input
          value={type}
          readOnly
          className="pointer-events-none h-9 border-gray-200 bg-gray-50 pr-32 text-left text-sm"
        />
        {type === "바로고" && totalAgencyFee && (
          <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-gray-600">
            대행료 합계 {totalAgencyFee.toLocaleString()}원
          </span>
        )}
      </div>
    </div>
  );
}

function DeliveryCostDetail({
  deliveryInfo,
  estimatedTimeHighlight,
  estimatedTimeRest,
}: {
  deliveryInfo: NonNullable<Transaction["deliveryInfo"]>;
  estimatedTimeHighlight?: string;
  estimatedTimeRest?: string;
}) {
  return (
    <div className="ml-28 space-y-2 rounded-md border border-gray-200 bg-gray-50 p-3">
      {deliveryInfo.distance && deliveryInfo.agencyFee && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">거리 비례 대행료 (거리{deliveryInfo.distance}km)</span>
          <span className="font-medium">{deliveryInfo.agencyFee.toLocaleString()}원</span>
        </div>
      )}
      {deliveryInfo.rainyDaySurcharge && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">우천 할증</span>
          <span className="font-medium">{deliveryInfo.rainyDaySurcharge.toLocaleString()}원</span>
        </div>
      )}
      {deliveryInfo.vat && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">부가세</span>
          <span className="font-medium">{deliveryInfo.vat.toLocaleString()}원</span>
        </div>
      )}
      {deliveryInfo.estimatedTime && (
        <div className="mt-2 text-right text-sm">
          <span className="font-medium text-blue-600">{estimatedTimeHighlight}</span>
          {estimatedTimeRest && <span className="text-gray-900"> {estimatedTimeRest}</span>}
        </div>
      )}
    </div>
  );
}

export function TransactionDetailDeliveryInfo({
  transaction,
  category,
  totalAgencyFee,
  estimatedTimeHighlight,
  estimatedTimeRest,
}: TransactionDetailDeliveryInfoProps) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold">배달정보</h3>
      <div className="space-y-4">
        <DeliveryStatusRow
          label="상태"
          value={category === "canceled" ? (transaction.refundStatus ?? "") : (transaction.deliveryInfo?.status ?? "")}
        />

        {category === "order" ? (
          <div className="space-y-2">
            <DeliveryTypeInput type={transaction.type} totalAgencyFee={totalAgencyFee} />
            {transaction.type === "바로고" && transaction.deliveryInfo && (
              <DeliveryCostDetail
                deliveryInfo={transaction.deliveryInfo}
                estimatedTimeHighlight={estimatedTimeHighlight}
                estimatedTimeRest={estimatedTimeRest}
              />
            )}
          </div>
        ) : category !== "canceled" ? (
          <DeliveryStatusRow label="구분" value={transaction.type} />
        ) : null}
      </div>
    </div>
  );
}
