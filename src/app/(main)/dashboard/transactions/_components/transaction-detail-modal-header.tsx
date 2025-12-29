"use client";

import { Badge } from "@/components/ui/badge";
import { SERVICE_CONFIG } from "@/config/service-config";
import type { Transaction, CanceledTransaction } from "@/types/transaction.type";

interface TransactionDetailModalHeaderProps {
  transaction: Transaction | CanceledTransaction;
  category: "order" | "order-request" | "canceled";
}

export function TransactionDetailModalHeader({ transaction, category }: TransactionDetailModalHeaderProps) {
  return (
    <div className="bg-background border-b px-6 py-3">
      <div className="flex items-center justify-between gap-4 text-sm">
        <div className="flex items-center gap-4">
          <span className="font-medium">{transaction.transactionNumber}</span>
          <span>{transaction.fromNickname}</span>
          <span>{transaction.toNickname}</span>
          <div className="h-8 w-8 shrink-0 rounded-full bg-gray-200" />
          <span>{transaction.productName}</span>
        </div>
        <div className="flex items-center gap-4">
          <span>{transaction.paymentAmount.toLocaleString()}원</span>
          <span>{transaction.orderDate}</span>
          <span>{transaction.paymentDate}</span>
          {category !== "canceled" && (
            <Badge variant="outline">
              {SERVICE_CONFIG.paymentMethod[transaction.paymentMethod as keyof typeof SERVICE_CONFIG.paymentMethod] ??
                transaction.paymentMethod}
            </Badge>
          )}
          {category === "order" && (
            <Badge variant="secondary">
              {SERVICE_CONFIG.transactionType[transaction.type as keyof typeof SERVICE_CONFIG.transactionType] ??
                transaction.type}
            </Badge>
          )}
          {category === "canceled" && "status" in transaction && (
            <Badge variant="outline">
              {SERVICE_CONFIG.refundStatus[transaction.status as keyof typeof SERVICE_CONFIG.refundStatus] ??
                transaction.status}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
