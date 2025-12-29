"use client";

import { useState, useCallback, useEffect } from "react";

import { getSettlementDetail } from "@/service/settlement.service";
import type { SettlementDetail } from "@/types/settlement.type";
import type { PaymentMethod } from "@/types/transaction.type";

import { TransactionDetailModal } from "../../../transactions/_components/transaction-detail-modal";

import { PaymentMethodBreakdownDialog } from "./payment-method-breakdown-dialog";
import { SettlementDetailTable } from "./settlement-detail-table";
import { SettlementInfoCard } from "./settlement-info-card";

interface SettlementDetailProps {
  settlementId: string;
}

export function SettlementDetail({ settlementId }: SettlementDetailProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isPaymentBreakdownOpen, setIsPaymentBreakdownOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<SettlementDetail["transactions"][0] | null>(null);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [settlementDetail, setSettlementDetail] = useState<SettlementDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedTransactionDate, setSelectedTransactionDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    const fetchSettlementDetail = async () => {
      try {
        setIsLoading(true);
        const data = await getSettlementDetail(parseInt(settlementId));
        setSettlementDetail(data);
        if (data.transactions.length > 0) {
          const firstTransactionDate = new Date(data.transactions[0].orderDate);
          setSelectedDate(firstTransactionDate);
        }
      } catch (error) {
        console.error("Failed to fetch settlement detail:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettlementDetail();
  }, [settlementId]);

  const handleDownload = useCallback((transaction: SettlementDetail["transactions"][0]) => {
    const data = [
      ["주문번호", "From", "To", "상품명", "결제금액", "주문접수일", "결제일", "결제방법", "구분"],
      [
        transaction.transactionNumber,
        transaction.fromNickname,
        transaction.toNickname,
        transaction.productName,
        transaction.paymentAmount.toString(),
        transaction.orderDate,
        transaction.paymentDate,
        transaction.paymentMethod,
        transaction.type,
      ],
    ];

    const csvContent = data.map((row) => row.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${transaction.transactionNumber}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const handleViewDetail = useCallback((transaction: SettlementDetail["transactions"][0]) => {
    setSelectedTransaction(transaction);
    setIsTransactionModalOpen(true);
  }, []);

  if (isLoading || !settlementDetail) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <SettlementInfoCard
          settlement={settlementDetail}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          isDatePickerOpen={isDatePickerOpen}
          onDatePickerOpenChange={setIsDatePickerOpen}
          onPaymentBreakdownClick={() => setIsPaymentBreakdownOpen(true)}
        />

        <SettlementDetailTable
          transactions={settlementDetail.transactions}
          search={search}
          onSearchChange={setSearch}
          selectedPaymentMethods={selectedPaymentMethods}
          onPaymentMethodsChange={setSelectedPaymentMethods}
          selectedDate={selectedTransactionDate}
          onDateChange={setSelectedTransactionDate}
          onViewDetail={handleViewDetail}
          onDownload={handleDownload}
        />
      </div>

      <PaymentMethodBreakdownDialog
        open={isPaymentBreakdownOpen}
        onOpenChange={setIsPaymentBreakdownOpen}
        breakdown={{
          card: settlementDetail.cardPaymentAmount,
          bankTransfer: settlementDetail.bankTransferPaymentAmount,
          pos: settlementDetail.posPaymentAmount,
        }}
      />

      <TransactionDetailModal
        open={isTransactionModalOpen}
        onOpenChange={setIsTransactionModalOpen}
        transaction={selectedTransaction}
      />
    </>
  );
}
