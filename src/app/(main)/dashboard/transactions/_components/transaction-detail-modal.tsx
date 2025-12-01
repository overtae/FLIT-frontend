"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { TransactionDetailCustomerInfo } from "./transaction-detail-customer-info";
import { TransactionDetailDeliveryInfo } from "./transaction-detail-delivery-info";
import { TransactionDetailFloristInfo } from "./transaction-detail-florist-info";
import { TransactionDetailModalHeader } from "./transaction-detail-modal-header";
import { TransactionDetailPurchaseInfo } from "./transaction-detail-purchase-info";
import { Transaction } from "./transaction-types";

interface TransactionDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
  category?: "order" | "order-request" | "canceled";
}

export function TransactionDetailModal({
  open,
  onOpenChange,
  transaction,
  category = "order",
}: TransactionDetailModalProps) {
  if (!transaction) return null;

  const totalAgencyFee =
    transaction.deliveryInfo?.agencyFee &&
    transaction.deliveryInfo.agencyFee +
      (transaction.deliveryInfo.rainyDaySurcharge ?? 0) +
      (transaction.deliveryInfo.vat ?? 0);

  const extractTimeFromEstimated = (estimatedTime?: string) => {
    if (!estimatedTime) return { time: "", rest: "" };
    const match = estimatedTime.match(/(\d+분 후)/);
    if (match) {
      return {
        time: match[1],
        rest: estimatedTime.replace(match[1], "").trim(),
      };
    }
    return { time: "", rest: estimatedTime };
  };

  const { time: estimatedTimeHighlight, rest: estimatedTimeRest } = extractTimeFromEstimated(
    transaction.deliveryInfo?.estimatedTime,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="w-full max-w-6xl gap-0 overflow-hidden p-0 sm:max-w-6xl">
        <DialogHeader className="sr-only">
          <DialogTitle>주문 상세 정보</DialogTitle>
        </DialogHeader>

        <div className="flex max-h-[80vh] flex-col overflow-hidden">
          <TransactionDetailModalHeader transaction={transaction} category={category} />

          <div className="custom-scrollbar flex-1 overflow-y-auto bg-white px-4 py-6 sm:px-8 sm:py-8">
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-6">
                <TransactionDetailFloristInfo transaction={transaction} />
                <TransactionDetailCustomerInfo transaction={transaction} />
              </div>

              <div className="space-y-6">
                <TransactionDetailPurchaseInfo transaction={transaction} category={category} />
              </div>

              <div className="space-y-6">
                <TransactionDetailDeliveryInfo
                  transaction={transaction}
                  category={category}
                  totalAgencyFee={totalAgencyFee}
                  estimatedTimeHighlight={estimatedTimeHighlight}
                  estimatedTimeRest={estimatedTimeRest}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button variant="secondary" className="rounded-md bg-gray-300 px-6 text-white hover:bg-gray-400">
                삭제
              </Button>
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
