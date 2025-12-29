"use client";

import { useState, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getTransaction, deleteTransaction } from "@/service/transaction.service";
import type { Transaction, CanceledTransaction, TransactionDetail } from "@/types/transaction.type";

import { TransactionDetailCustomerInfo } from "./transaction-detail-customer-info";
import { TransactionDetailDeliveryInfo } from "./transaction-detail-delivery-info";
import { TransactionDetailFloristInfo } from "./transaction-detail-florist-info";
import { TransactionDetailModalHeader } from "./transaction-detail-modal-header";
import { TransactionDetailPurchaseInfo } from "./transaction-detail-purchase-info";

interface TransactionDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | CanceledTransaction | null;
  category?: "order" | "order-request" | "canceled";
}

export function TransactionDetailModal({
  open,
  onOpenChange,
  transaction,
  category = "order",
}: TransactionDetailModalProps) {
  const [transactionDetail, setTransactionDetail] = useState<TransactionDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (transaction && open) {
      const fetchDetail = async () => {
        try {
          setIsLoading(true);
          const detail = await getTransaction(transaction.transactionId);
          setTransactionDetail(detail);
        } catch (error) {
          console.error("Failed to fetch transaction detail:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchDetail();
    }
  }, [transaction, open]);

  if (!transaction || !transactionDetail) return null;

  const totalAgencyFee = transactionDetail.deliveryInformation
    ? transactionDetail.deliveryInformation.distanceDeliveryAmount +
      (transactionDetail.deliveryInformation.rainSurcharge || 0) +
      (transactionDetail.deliveryInformation.vat || 0)
    : 0;

  const handleOpenAutoFocus = (e: Event) => {
    e.preventDefault();
    if (closeButtonRef.current) {
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 0);
    }
  };

  const handleDelete = async () => {
    if (!transaction) return;

    if (!confirm("정말 삭제하시겠습니까?")) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteTransaction(transaction.transactionId);
      onOpenChange(false);
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete transaction:", error);
      alert("삭제에 실패했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-full max-w-6xl gap-0 overflow-hidden p-0 sm:max-w-6xl"
        onOpenAutoFocus={handleOpenAutoFocus}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>주문 상세 정보</DialogTitle>
        </DialogHeader>

        <div className="flex max-h-[80vh] flex-col overflow-hidden">
          <TransactionDetailModalHeader transaction={transaction} category={category} />

          <div className="custom-scrollbar flex-1 overflow-y-auto bg-white px-4 py-6 sm:px-8 sm:py-8">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-muted-foreground">Loading...</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-6">
                  <TransactionDetailFloristInfo transaction={transactionDetail} />
                  <TransactionDetailCustomerInfo transaction={transactionDetail} />
                </div>

                <div className="space-y-6">
                  <TransactionDetailPurchaseInfo transaction={transactionDetail} category={category} />
                </div>

                <div className="space-y-6">
                  <TransactionDetailDeliveryInfo
                    transaction={transactionDetail}
                    category={category}
                    totalAgencyFee={totalAgencyFee}
                  />
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <Button
                variant="secondary"
                className="rounded-md bg-gray-300 px-6 text-white hover:bg-gray-400"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "삭제 중..." : "삭제"}
              </Button>
              <Button
                ref={closeButtonRef}
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
