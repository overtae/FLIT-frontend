"use client";

import { useMemo, useState, useEffect, useCallback } from "react";

import { useSearchParams } from "next/navigation";

import * as XLSX from "@e965/xlsx";
import { Search } from "lucide-react";

import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableWithSelection } from "@/components/data-table/data-table-with-selection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { useFilteredPagination } from "@/hooks/use-filtered-pagination";
import { getTransactionOrders, getTransactionOrdering, getCanceledTransactions } from "@/service/transaction.service";
import type { Transaction, TransactionType, PaymentMethod, RefundStatus } from "@/types/transaction.type";

import { createTransactionColumns } from "./transaction-columns";
import { TransactionDetailModal } from "./transaction-detail-modal";
import { TransactionFilter } from "./transaction-filter";

interface TransactionListProps {
  category: "order" | "order-request" | "canceled";
  subCategory?: "all" | "shop" | "florist" | "order-request";
}

export function TransactionList({ category, subCategory }: TransactionListProps) {
  const searchParams = useSearchParams();
  const urlPage = useMemo(() => {
    const pageParam = searchParams.get("page");
    return pageParam ? parseInt(pageParam, 10) - 1 : 0;
  }, [searchParams]);
  const urlPageSize = useMemo(() => {
    const pageSizeParam = searchParams.get("pageSize");
    return pageSizeParam ? parseInt(pageSizeParam, 10) : 10;
  }, [searchParams]);

  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<TransactionType[]>([]);
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedRefundStatuses, setSelectedRefundStatuses] = useState<RefundStatus[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        let data: Transaction[] = [];

        if (category === "order") {
          const type = subCategory === "shop" ? "SHOP" : subCategory === "florist" ? "FLORIST" : "ALL";
          data = await getTransactionOrders({ type });
        } else if (category === "order-request") {
          data = await getTransactionOrdering({});
        } else if (category === "canceled") {
          const type =
            subCategory === "shop"
              ? "SHOP"
              : subCategory === "florist"
                ? "FLORIST"
                : subCategory === "order-request"
                  ? "ORDERING"
                  : "ALL";
          data = await getCanceledTransactions({ type });
        }

        setAllTransactions(data);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [category, subCategory]);

  const filterFn = useMemo(
    () => (transaction: Transaction) => {
      if (search.trim()) {
        const searchLower = search.toLowerCase();
        const matchesSearch =
          transaction.transactionNumber.toLowerCase().includes(searchLower) ||
          transaction.fromNickname.toLowerCase().includes(searchLower) ||
          transaction.toNickname.toLowerCase().includes(searchLower) ||
          transaction.productName.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      if (selectedTypes.length > 0 && category === "order") {
        if (!transaction.type) return false;
        const transactionTypeUpper = String(transaction.type).toUpperCase();
        if (!selectedTypes.includes(transactionTypeUpper as TransactionType)) {
          return false;
        }
      }

      if (selectedPaymentMethods.length > 0 && category !== "canceled") {
        if (!transaction.paymentMethod) return false;
        const paymentMethodUpper = String(transaction.paymentMethod).toUpperCase();
        if (!selectedPaymentMethods.includes(paymentMethodUpper as PaymentMethod)) {
          return false;
        }
      }

      if (selectedRefundStatuses.length > 0 && category === "canceled") {
        if (!transaction.status) return false;
        const statusUpper = String(transaction.status).toUpperCase();
        if (!selectedRefundStatuses.includes(statusUpper as RefundStatus)) {
          return false;
        }
      }

      if (selectedDate) {
        const date = new Date(transaction.orderDate);
        if (date.toDateString() !== selectedDate.toDateString()) {
          return false;
        }
      }

      return true;
    },
    [search, selectedTypes, selectedPaymentMethods, selectedRefundStatuses, selectedDate, category],
  );

  const { paginatedData, pageCount, pageIndex, pageSize, setPageIndex, setPageSize, resetPagination } =
    useFilteredPagination({
      data: allTransactions,
      filterFn,
      initialPageIndex: urlPage,
      initialPageSize: urlPageSize,
    });

  useEffect(() => {
    setPageIndex(urlPage);
  }, [setPageIndex, urlPage]);

  useEffect(() => {
    setPageSize(urlPageSize);
  }, [setPageSize, urlPageSize]);

  const filterKey = useMemo(
    () =>
      JSON.stringify({
        search,
        selectedTypes,
        selectedPaymentMethods,
        selectedRefundStatuses,
        selectedDate: selectedDate?.toISOString(),
      }),
    [search, selectedTypes, selectedPaymentMethods, selectedRefundStatuses, selectedDate],
  );

  const handleTypesChange = useCallback(
    (types: TransactionType[]) => {
      setSelectedTypes(types);
      resetPagination();
    },
    [resetPagination],
  );

  const handlePaymentMethodsChange = useCallback(
    (methods: PaymentMethod[]) => {
      setSelectedPaymentMethods(methods);
      resetPagination();
    },
    [resetPagination],
  );

  const handleRefundStatusesChange = useCallback(
    (statuses: RefundStatus[]) => {
      setSelectedRefundStatuses(statuses);
      resetPagination();
    },
    [resetPagination],
  );

  const handleDateChange = useCallback(
    (date: Date | undefined) => {
      setSelectedDate(date);
      resetPagination();
    },
    [resetPagination],
  );

  const handleViewDetail = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDownload = (transaction: Transaction) => {
    const data = [
      {
        주문번호: transaction.transactionNumber,
        From: transaction.fromNickname,
        To: transaction.toNickname,
        상품명: transaction.productName,
        결제금액: transaction.paymentAmount,
        주문접수일: transaction.orderDate,
        결제일: transaction.paymentDate,
        결제방법: transaction.paymentMethod ?? "",
        구분: transaction.type ?? transaction.status ?? "",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "거래 내역");
    const fileName = `${transaction.transactionNumber}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const columns = useMemo(
    () =>
      createTransactionColumns({
        onViewDetail: handleViewDetail,
        onDownload: handleDownload,
        category,
      }),
    [category],
  );

  const { table, rowSelection } = useDataTableInstance({
    data: paginatedData,
    columns: columns as any,
    getRowId: (row) => row.transactionId.toString(),
    manualPagination: true,
    pageCount,
    defaultPageIndex: pageIndex,
    defaultPageSize: pageSize,
  });

  useEffect(() => {
    table.setPagination({ pageIndex, pageSize });
  }, [table, pageIndex, pageSize]);

  const handleDownloadAll = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    if (selectedRows.length === 0) return;

    const transactionsToDownload = selectedRows.map((row) => row.original);

    const data = transactionsToDownload.map((t) => ({
      주문번호: t.transactionNumber,
      From: t.fromNickname,
      To: t.toNickname,
      상품명: t.productName,
      결제금액: t.paymentAmount,
      주문접수일: t.orderDate,
      결제일: t.paymentDate,
      결제방법: t.paymentMethod ?? "",
      구분: t.type ?? t.status ?? "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "거래 목록");
    const fileName = `주문목록_${new Date().toISOString().split("T")[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-full flex-col space-y-4">
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-2">
            <div className="relative w-[300px]">
              <Input
                placeholder=""
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  resetPagination();
                }}
                className="h-9 rounded-full pr-10 pl-4"
              />
              <Search className="text-muted-foreground absolute top-2.5 right-3 h-4 w-4" />
            </div>
            <TransactionFilter
              type={category}
              selectedTypes={selectedTypes}
              onTypesChange={handleTypesChange}
              selectedPaymentMethods={selectedPaymentMethods}
              onPaymentMethodsChange={handlePaymentMethodsChange}
              selectedRefundStatuses={selectedRefundStatuses}
              onRefundStatusesChange={handleRefundStatusesChange}
              selectedDate={selectedDate}
              onDateChange={handleDateChange}
            />
          </div>
        </div>
        <div className="flex-1 rounded-md">
          <DataTableWithSelection table={table} rowSelection={rowSelection} filterKey={filterKey} />
        </div>
        <div className="border-t px-4 py-4">
          <DataTablePagination
            table={table}
            leftSlot={
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadAll}
                disabled={Object.keys(rowSelection).length === 0}
              >
                전체 다운로드
              </Button>
            }
          />
        </div>
      </div>

      <TransactionDetailModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        transaction={selectedTransaction}
        category={category}
      />
    </>
  );
}
