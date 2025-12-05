"use client";

import { useState, useMemo, useCallback } from "react";

import { PaymentMethodBreakdownDialog } from "./payment-method-breakdown-dialog";
import { SettlementDetailTransaction } from "./settlement-detail-columns";
import { SettlementDetailTable } from "./settlement-detail-table";
import { SettlementInfoCard } from "./settlement-info-card";
import { TransactionDetailModal } from "./transaction-detail-modal";

interface SettlementDetailData {
  id: string;
  nickname: string;
  nicknameId: string;
  phone: string;
  email: string;
  settlementDate: Date;
  lastUpdated: Date;
  settlementAmount: number;
  paymentAmount: number;
  paymentCount: number;
  deliveryCount: number;
  commission: number;
  refundCancelAmount: number;
  refundCancelCount: number;
  deliveryFee: number;
  paymentMethodBreakdown: {
    card: number;
    account: number;
    pos: number;
  };
}

const mockSettlementDetail: SettlementDetailData = {
  id: "1",
  nickname: "매장A",
  nicknameId: "shop001",
  phone: "010-1234-5678",
  email: "shop@example.com",
  settlementDate: new Date(2024, 0, 15),
  lastUpdated: new Date(2024, 0, 20, 14, 30),
  settlementAmount: 950000,
  paymentAmount: 1000000,
  paymentCount: 25,
  deliveryCount: 20,
  commission: 100000,
  refundCancelAmount: 50000,
  refundCancelCount: 2,
  deliveryFee: 50000,
  paymentMethodBreakdown: {
    card: 600000,
    account: 300000,
    pos: 100000,
  },
};

const mockTransactions: SettlementDetailTransaction[] = [
  {
    id: "1",
    orderNumber: "AAD0123AB10",
    from: "아미화 (sm101)",
    to: "규팀장 (QQQ)",
    productName: "엔티크 장미 꽃다발",
    paymentAmount: 50000,
    orderDate: "2024-01-10",
    paymentDate: "2024-01-10",
    paymentMethod: "카드결제",
    type: "바로고",
  },
  {
    id: "2",
    orderNumber: "CVD0123AC43",
    from: "오후 (Jeon)",
    to: "지니 (jini)",
    productName: "장미 | 튤립 꽃바구니",
    paymentAmount: 123000,
    orderDate: "2024-01-11",
    paymentDate: "2024-01-11",
    paymentMethod: "POS결제",
    type: "픽업",
  },
  {
    id: "3",
    orderNumber: "CDA0123CB11",
    from: "매장A (shop001)",
    to: "고객A",
    productName: "장미 꽃다발",
    paymentAmount: 45000,
    orderDate: "2024-01-12",
    paymentDate: "2024-01-12",
    paymentMethod: "계좌이체",
    type: "바로고",
  },
];

interface SettlementDetailProps {
  settlementId: string;
}

export function SettlementDetail({ settlementId: _settlementId }: SettlementDetailProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(mockSettlementDetail.settlementDate);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isPaymentBreakdownOpen, setIsPaymentBreakdownOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<SettlementDetailTransaction | null>(null);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredTransactions = useMemo(() => {
    let data = mockTransactions;

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
  }, [search]);

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

  return (
    <>
      <div className="space-y-6">
        <SettlementInfoCard
          settlement={mockSettlementDetail}
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
        breakdown={mockSettlementDetail.paymentMethodBreakdown}
      />

      <TransactionDetailModal
        open={isTransactionModalOpen}
        onOpenChange={setIsTransactionModalOpen}
        transaction={selectedTransaction}
      />
    </>
  );
}
