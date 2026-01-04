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
    <section className="w-full space-y-4">
      <div className="flex items-center justify-end gap-2">
        <div className="max-w-sm flex-1">
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
      <div className="flex w-full flex-col gap-4">
        <div className="overflow-hidden rounded-md border">
          <DataTableWithSelection table={table} rowSelection={rowSelection} onRowClick={onViewDetail} />
        </div>
        <DataTablePagination
          table={table}
          leftSlot={
            <Button variant="outline" onClick={handleDownloadAll} disabled={Object.keys(rowSelection).length === 0}>
              <Download className="mr-2 h-4 w-4" />
              전체 다운로드
            </Button>
          }
        />
      </div>
    </section>
  );
}
