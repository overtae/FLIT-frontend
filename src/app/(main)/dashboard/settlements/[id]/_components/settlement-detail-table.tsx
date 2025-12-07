"use client";

import { useMemo, useCallback } from "react";

import { format } from "date-fns";
import { Download, Search, Filter } from "lucide-react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  onDownload,
}: SettlementDetailTableProps) {
  const columns = useMemo(
    () => createSettlementDetailColumns({ onDownload, onViewDetail }),
    [onDownload, onViewDetail],
  );

  const table = useDataTableInstance({
    data: transactions,
    columns,
    getRowId: (row) => row.id,
    manualFiltering: true,
  });

  const handleDownloadAll = useCallback(() => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    if (selectedRows.length === 0) return;

    const transactionsToDownload = selectedRows.map((row) => row.original);

    const data = [
      ["주문번호", "From", "To", "상품명", "결제금액", "주문접수일", "결제일", "결제방법", "구분"],
      ...transactionsToDownload.map((t) => [
        t.orderNumber,
        t.from,
        t.to,
        t.productName,
        t.paymentAmount.toString(),
        t.orderDate,
        t.paymentDate,
        t.paymentMethod,
        t.type,
      ]),
    ];

    const csvContent = data.map((row) => row.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `정산상세_${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [table]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>정산 상세</CardTitle>
        <CardAction>
          <div className="flex items-center gap-2">
            <div className="relative max-w-sm flex-1">
              <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
              <Input
                placeholder="검색..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              필터
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadAll}>
              <Download className="mr-2 h-4 w-4" />
              엑셀 다운로드
            </Button>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="flex size-full flex-col gap-4">
        <div className="overflow-hidden rounded-md border">
          <DataTable table={table} columns={columns} onRowClick={onViewDetail} />
        </div>
        <div className="border-t px-4 py-4">
          <DataTablePagination
            table={table}
            leftSlot={
              <Button variant="outline" size="sm" onClick={handleDownloadAll}>
                <Download className="mr-2 h-4 w-4" />
                엑셀 다운로드
              </Button>
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
