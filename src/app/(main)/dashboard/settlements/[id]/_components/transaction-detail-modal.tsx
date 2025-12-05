"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { SettlementDetailTransaction } from "./settlement-detail-columns";

interface TransactionDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: SettlementDetailTransaction | null;
}

export function TransactionDetailModal({ open, onOpenChange, transaction }: TransactionDetailModalProps) {
  if (!transaction) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-4xl gap-0 overflow-hidden p-0 sm:max-w-4xl">
        <DialogHeader className="sr-only">
          <DialogTitle>거래 상세 정보</DialogTitle>
        </DialogHeader>

        <div className="flex max-h-[80vh] flex-col overflow-hidden">
          <div className="border-b bg-gray-50 px-6 py-3">
            <div className="flex items-center justify-between gap-4 text-sm">
              <div className="flex items-center gap-4">
                <span className="font-medium">{transaction.orderNumber}</span>
                <span>{transaction.from}</span>
                <span>{transaction.to}</span>
                <span>{transaction.productName}</span>
              </div>
              <div className="flex items-center gap-4">
                <span>{transaction.paymentAmount.toLocaleString()}원</span>
                <span>{transaction.orderDate}</span>
                <span>{transaction.paymentDate}</span>
              </div>
            </div>
          </div>

          <div className="custom-scrollbar flex-1 overflow-y-auto bg-white px-4 py-6 sm:px-8 sm:py-8">
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 text-sm font-semibold">거래 정보</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">주문번호</span>
                    <span className="font-medium">{transaction.orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">From</span>
                    <span className="font-medium">{transaction.from}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">To</span>
                    <span className="font-medium">{transaction.to}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">상품명</span>
                    <span className="font-medium">{transaction.productName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">결제금액</span>
                    <span className="font-medium">{transaction.paymentAmount.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">주문접수일</span>
                    <span className="font-medium">{transaction.orderDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">결제일</span>
                    <span className="font-medium">{transaction.paymentDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">결제방법</span>
                    <span className="font-medium">{transaction.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">구분</span>
                    <span className="font-medium">{transaction.type}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button
                variant="outline"
                className="rounded-md border-gray-300 bg-white px-6 text-gray-900 hover:bg-gray-50"
                onClick={() => onOpenChange(false)}
              >
                닫기
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
