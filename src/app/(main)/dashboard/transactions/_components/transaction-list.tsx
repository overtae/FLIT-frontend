"use client";

import { useMemo, useState } from "react";

import { Search } from "lucide-react";
import * as XLSX from "xlsx";

import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableWithSelection } from "@/components/data-table/data-table-with-selection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";

import { mockTransactions } from "./mock-transactions";
import { createTransactionColumns } from "./transaction-columns";
import { TransactionDetailModal } from "./transaction-detail-modal";
import { TransactionFilter } from "./transaction-filter";
import { Transaction, PaymentMethod, TransactionType } from "./transaction-types";

interface TransactionListProps {
  category: "order" | "order-request" | "canceled";
  subCategory?: "all" | "shop" | "florist" | "order-request";
}

export function TransactionList({ category, subCategory }: TransactionListProps) {
  const [search, setSearch] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState<{
    types?: TransactionType[];
    paymentMethods?: PaymentMethod[];
    refundStatuses?: string[];
    date?: Date;
  }>({});

  const filteredData = useMemo(() => {
    let data = mockTransactions.filter((t) => {
      if (category === "order") {
        return t.subCategory === subCategory || subCategory === "all";
      }
      if (category === "order-request") {
        return true;
      }
      if (category === "canceled") {
        const hasRefundStatus = t.refundStatus !== undefined;
        if (subCategory && subCategory !== "order-request") {
          return hasRefundStatus && t.subCategory === subCategory;
        }
        return hasRefundStatus;
      }
      return true;
    });

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

    if (filters.types && filters.types.length > 0) {
      data = data.filter((t) => filters.types!.includes(t.type));
    }

    if (filters.paymentMethods && filters.paymentMethods.length > 0) {
      data = data.filter((t) => filters.paymentMethods!.includes(t.paymentMethod));
    }

    if (filters.refundStatuses && filters.refundStatuses.length > 0) {
      data = data.filter((t) => t.refundStatus && filters.refundStatuses!.includes(t.refundStatus));
    }

    if (filters.date) {
      const filterDate = filters.date.toISOString().split("T")[0];
      const filterYearMonth = filterDate.substring(0, 7);
      data = data.filter((t) => {
        const orderDate = t.orderDate.replace(/\./g, "-");
        const yearMonth = orderDate.substring(0, 7);
        return yearMonth === filterYearMonth;
      });
    }

    return data;
  }, [category, subCategory, search, filters]);

  const handleViewDetail = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDownload = (transaction: Transaction) => {
    const data = [
      {
        주문번호: transaction.orderNumber,
        From: transaction.from,
        To: transaction.to,
        상품명: transaction.productName,
        결제금액: transaction.paymentAmount,
        주문접수일: transaction.orderDate,
        결제일: transaction.paymentDate,
        결제방법: transaction.paymentMethod,
        구분: transaction.type,
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "거래 내역");
    const fileName = `${transaction.orderNumber}.xlsx`;
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
    data: filteredData,
    columns,
    getRowId: (row) => row.id,
    manualFiltering: true,
  });

  const handleDownloadAll = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    if (selectedRows.length === 0) return;

    const transactionsToDownload = selectedRows.map((row) => row.original);

    const data = transactionsToDownload.map((t) => ({
      주문번호: t.orderNumber,
      From: t.from,
      To: t.to,
      상품명: t.productName,
      결제금액: t.paymentAmount,
      주문접수일: t.orderDate,
      결제일: t.paymentDate,
      결제방법: t.paymentMethod,
      구분: t.type,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "거래 목록");
    const fileName = `주문목록_${new Date().toISOString().split("T")[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <>
      <div className="flex min-h-full flex-col space-y-4">
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-2">
            <div className="relative w-[300px]">
              <Input
                placeholder=""
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 rounded-full pr-10 pl-4"
              />
              <Search className="text-muted-foreground absolute top-2.5 right-3 h-4 w-4" />
            </div>
            <TransactionFilter type={category} onFilterChange={setFilters} />
          </div>
        </div>
        <div className="flex-1 rounded-md">
          <DataTableWithSelection table={table} rowSelection={rowSelection} />
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
