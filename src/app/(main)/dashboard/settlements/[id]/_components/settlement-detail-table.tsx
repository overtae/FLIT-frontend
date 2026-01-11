"use client";

import { useMemo, useCallback } from "react";

import * as XLSX from "@e965/xlsx";
import { format } from "date-fns";
import { Download } from "lucide-react";

import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableWithSelection } from "@/components/data-table/data-table-with-selection";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import type { SettlementDetail } from "@/types/settlement.type";
import type { PaymentMethod } from "@/types/transaction.type";

import { createSettlementDetailColumns } from "./settlement-detail-columns";
import { SettlementDetailFilter } from "./settlement-detail-filter";

type SettlementDetailTransaction = SettlementDetail["transactions"][0];

interface SettlementDetailTableProps {
  transactions: SettlementDetailTransaction[];
  search: string;
  onSearchChange: (value: string) => void;
  selectedPaymentMethods: PaymentMethod[];
  onPaymentMethodsChange: (methods: PaymentMethod[]) => void;
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  onViewDetail: (transaction: SettlementDetailTransaction) => void;
  onDownload: (transaction: SettlementDetailTransaction) => void;
}

export function SettlementDetailTable({
  transactions,
  search,
  onSearchChange,
  selectedPaymentMethods,
  onPaymentMethodsChange,
  selectedDate,
  onDateChange,
  onViewDetail,
}: SettlementDetailTableProps) {
  const columns = useMemo(() => createSettlementDetailColumns({ onViewDetail }), [onViewDetail]);

  const { table, rowSelection } = useDataTableInstance({
    data: transactions,
    columns,
    getRowId: (row) => row.transactionId.toString(),
    manualFiltering: true,
  });

  const handleDownloadAll = useCallback(() => {
    const filteredRows = table.getFilteredRowModel().rows;
    const selectedRows = filteredRows.filter((row) => row.getIsSelected());
    if (selectedRows.length === 0) return;

    const data = selectedRows.map((row) => ({
      주문번호: row.original.transactionNumber,
      From: row.original.fromNickname,
      To: row.original.toNickname,
      상품명: row.original.productName,
      결제금액: row.original.paymentAmount.toLocaleString(),
      주문접수일: row.original.orderDate,
      결제일: row.original.paymentDate,
      결제방법: row.original.paymentMethod,
      구분: row.original.type,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "정산 상세");

    const fileName = `정산상세_${format(new Date(), "yyyy-MM-dd")}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  }, [table]);

  return (
    <section className="w-full space-y-3 sm:space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-2">
        <div className="w-full max-w-sm flex-1 sm:w-auto">
          <SearchInput
            value={search}
            onChange={onSearchChange}
            placeholder="검색..."
            iconPosition="left"
            className="w-full"
          />
        </div>
        <SettlementDetailFilter
          selectedPaymentMethods={selectedPaymentMethods}
          onPaymentMethodsChange={onPaymentMethodsChange}
          selectedDate={selectedDate}
          onDateChange={onDateChange}
        />
      </div>
      <div className="flex w-full flex-col gap-3 sm:gap-4">
        <div className="overflow-x-auto rounded-md border">
          <DataTableWithSelection table={table} rowSelection={rowSelection} onRowClick={onViewDetail} />
        </div>
        <DataTablePagination
          table={table}
          leftSlot={
            <Button
              variant="outline"
              onClick={handleDownloadAll}
              disabled={Object.keys(rowSelection).length === 0}
              className="text-xs sm:text-sm"
            >
              <Download className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">전체 다운로드</span>
              <span className="sm:hidden">다운로드</span>
            </Button>
          }
        />
      </div>
    </section>
  );
}
