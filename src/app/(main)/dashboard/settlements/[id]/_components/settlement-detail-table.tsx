"use client";

import { useMemo, useCallback } from "react";

import * as XLSX from "@e965/xlsx";
import { format } from "date-fns";
import { Download, Search } from "lucide-react";

import { SettlementDetailFilter } from "@/app/(main)/dashboard/settlements/[id]/_components/settlement-detail-filter";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableWithSelection } from "@/components/data-table/data-table-with-selection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";

import { createSettlementDetailColumns, SettlementDetailTransaction } from "./settlement-detail-columns";

interface SettlementDetailTableProps {
  transactions: SettlementDetailTransaction[];
  search: string;
  onSearchChange: (value: string) => void;
  onViewDetail: (transaction: SettlementDetailTransaction) => void;
  onDownload: (transaction: SettlementDetailTransaction) => void;
}

export function SettlementDetailTable({
  transactions,
  search,
  onSearchChange,
  onViewDetail,
}: SettlementDetailTableProps) {
  const columns = useMemo(() => createSettlementDetailColumns({ onViewDetail }), [onViewDetail]);

  const { table, rowSelection } = useDataTableInstance({
    data: transactions,
    columns,
    getRowId: (row) => row.id,
    manualFiltering: true,
  });

  const handleDownloadAll = useCallback(() => {
    const filteredRows = table.getFilteredRowModel().rows;
    const selectedRows = filteredRows.filter((row) => row.getIsSelected());
    if (selectedRows.length === 0) return;

    const data = selectedRows.map((row) => ({
      주문번호: row.original.orderNumber,
      From: row.original.from,
      To: row.original.to,
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
        <div className="relative max-w-sm flex-1">
          <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
          <Input
            placeholder="검색..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
        <SettlementDetailFilter />
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
