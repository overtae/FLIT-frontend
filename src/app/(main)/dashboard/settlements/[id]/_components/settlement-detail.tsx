"use client";

import { useState, useMemo, useCallback, useEffect } from "react";

import { getSettlementDetail } from "@/service/settlement.service";
import { SettlementDetail as SettlementDetailType, SettlementDetailTransaction } from "@/types/dashboard";

import { PaymentMethodBreakdownDialog } from "./payment-method-breakdown-dialog";
import { SettlementDetailTable } from "./settlement-detail-table";
import { SettlementInfoCard } from "./settlement-info-card";
import { TransactionDetailModal } from "./transaction-detail-modal";

interface SettlementDetailProps {
  settlementId: string;
}

export function SettlementDetail({ settlementId }: SettlementDetailProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isPaymentBreakdownOpen, setIsPaymentBreakdownOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<SettlementDetailTransaction | null>(null);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [settlementDetail, setSettlementDetail] = useState<SettlementDetailType | null>(null);
  const [transactions, setTransactions] = useState<SettlementDetailTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettlementDetail = async () => {
      try {
        setIsLoading(true);
        const data = await getSettlementDetail(settlementId);
        setSettlementDetail(data.detail);
        setTransactions(data.transactions);
        setSelectedDate(data.detail.settlementDate);
      } catch (error) {
        console.error("Failed to fetch settlement detail:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettlementDetail();
  }, [settlementId]);

  const filteredTransactions = useMemo(() => {
    let data = transactions;

    if (search) {
      const searchLower = search.toLowerCase();
      data = data.filter(
        (t) =>
          t.orderNumber.toLowerCase().includes(searchLower) ||
          t.from.toLowerCase().includes(searchLower) ||
          t.to.toLowerCase().includes(searchLower) ||
          t.productName.toLowerCase().includes(searchLower),
      );
    }

    return data;
  }, [transactions, search]);

  const handleDownload = useCallback((transaction: SettlementDetailTransaction) => {
    const data = [
      ["주문번호", "From", "To", "상품명", "결제금액", "주문접수일", "결제일", "결제방법", "구분"],
      [
        transaction.orderNumber,
        transaction.from,
        transaction.to,
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
    link.setAttribute("download", `${transaction.orderNumber}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const handleViewDetail = useCallback((transaction: SettlementDetailTransaction) => {
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
          transactions={filteredTransactions}
          search={search}
          onSearchChange={setSearch}
          onViewDetail={handleViewDetail}
          onDownload={handleDownload}
        />
      </div>

      <PaymentMethodBreakdownDialog
        open={isPaymentBreakdownOpen}
        onOpenChange={setIsPaymentBreakdownOpen}
        breakdown={settlementDetail.paymentMethodBreakdown}
      />

      <TransactionDetailModal
        open={isTransactionModalOpen}
        onOpenChange={setIsTransactionModalOpen}
        transaction={selectedTransaction}
      />
    </>
  );
}
