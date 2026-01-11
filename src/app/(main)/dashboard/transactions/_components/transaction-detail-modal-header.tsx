"use client";

import { Badge } from "@/components/ui/badge";
import { SERVICE_CONFIG } from "@/config/service-config";
import type { Transaction } from "@/types/transaction.type";

interface TransactionDetailModalHeaderProps {
  transaction: Transaction;
  category: "order" | "order-request" | "canceled";
}

export function TransactionDetailModalHeader({ transaction, category }: TransactionDetailModalHeaderProps) {
  return (
    <div className="bg-background border-b px-3 py-2 sm:px-6 sm:py-3">
      <div className="flex flex-row items-center justify-between gap-2 text-xs sm:gap-4 sm:text-sm">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <span className="font-medium">{transaction.transactionNumber}</span>
          <span className="hidden sm:inline">{transaction.fromNickname}</span>
          <span className="hidden sm:inline">{transaction.toNickname}</span>
          <div className="hidden h-6 w-6 shrink-0 rounded-full bg-gray-200 sm:block sm:h-8 sm:w-8" />
          <span className="truncate">{transaction.productName}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <span>{transaction.paymentAmount.toLocaleString()}원</span>
          <span className="hidden sm:inline">{transaction.orderDate}</span>
          <span className="hidden sm:inline">{transaction.paymentDate}</span>
          {category !== "canceled" && transaction.paymentMethod && (
            <Badge variant="outline" className="text-xs">
              {SERVICE_CONFIG.paymentMethod[transaction.paymentMethod as keyof typeof SERVICE_CONFIG.paymentMethod] ??
                transaction.paymentMethod}
            </Badge>
          )}
          {category === "order" && transaction.type && (
            <Badge variant="secondary" className="text-xs">
              {SERVICE_CONFIG.transactionType[transaction.type as keyof typeof SERVICE_CONFIG.transactionType] ??
                transaction.type}
            </Badge>
          )}
          {category === "canceled" && transaction.status && (
            <Badge variant="outline" className="text-xs">
              {SERVICE_CONFIG.refundStatus[transaction.status as keyof typeof SERVICE_CONFIG.refundStatus] ??
                transaction.status}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
