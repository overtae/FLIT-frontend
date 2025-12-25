"use client";

import { Badge } from "@/components/ui/badge";

import { Transaction } from "./transaction-types";

interface TransactionDetailModalHeaderProps {
  transaction: Transaction;
  category: "order" | "order-request" | "canceled";
}

export function TransactionDetailModalHeader({ transaction, category }: TransactionDetailModalHeaderProps) {
  return (
    <div className="bg-background border-b px-6 py-3">
      <div className="flex items-center justify-between gap-4 text-sm">
        <div className="flex items-center gap-4">
          <span className="font-medium">{transaction.orderNumber}</span>
          <span>{transaction.from}</span>
          <span>{transaction.to}</span>
          <div className="h-8 w-8 shrink-0 rounded-full bg-gray-200" />
          <span>{transaction.productName}</span>
        </div>
        <div className="flex items-center gap-4">
          <span>{transaction.paymentAmount.toLocaleString()}원</span>
          <span>{transaction.orderDate}</span>
          <span>{transaction.paymentDate}</span>
          {category !== "canceled" && <Badge variant="outline">{transaction.paymentMethod}</Badge>}
          {category === "order" && <Badge variant="secondary">{transaction.type}</Badge>}
          {category === "canceled" && transaction.refundStatus && (
            <Badge variant="outline">{transaction.refundStatus}</Badge>
          )}
        </div>
      </div>
    </div>
  );
}
