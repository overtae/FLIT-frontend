"use client";

import { useMemo, useEffect, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { Download } from "lucide-react";
import * as XLSX from "xlsx";

import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableWithSelection } from "@/components/data-table/data-table-with-selection";
import { Button } from "@/components/ui/button";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { getRevenueDetails } from "@/service/sales.service";
import { RevenueDetail } from "@/types/dashboard";

import { revenueColumns } from "./columns.revenue";

export function RevenueDetailTable() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [revenueDetails, setRevenueDetails] = useState<RevenueDetail[]>([]);

  const pageIndex = parseInt(searchParams.get("page") ?? "1", 10) - 1;
  const pageSize = parseInt(searchParams.get("pageSize") ?? "10", 10);

  useEffect(() => {
    const fetchRevenueDetails = async () => {
      try {
        setIsLoading(true);
        const response = await getRevenueDetails({
          page: pageIndex + 1,
          pageSize,
        });

        setRevenueDetails(response.data);
        setTotal(response.total);
      } catch (error) {
        console.error("Failed to fetch revenue details:", error);
        setTotal(0);
        setRevenueDetails([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRevenueDetails();
  }, [pageIndex, pageSize]);

  const columns = useMemo(() => revenueColumns, []);

  const { table, rowSelection } = useDataTableInstance({
    data: revenueDetails,
    columns,
    getRowId: (row) => row.id,
    manualPagination: true,
    pageCount: total > 0 ? Math.ceil(total / pageSize) : 0,
    defaultPageIndex: pageIndex,
    defaultPageSize: pageSize,
  });

  useEffect(() => {
    const pagination = table.getState().pagination;
    const newPageIndex = pagination.pageIndex;
    const newPageSize = pagination.pageSize;

    if (newPageIndex !== pageIndex || newPageSize !== pageSize) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", (newPageIndex + 1).toString());
      params.set("pageSize", newPageSize.toString());
      router.push(`?${params.toString()}`, { scroll: false });
    }
  }, [table, pageIndex, pageSize, router, searchParams]);

  const handleDownloadAll = () => {
    const filteredRows = table.getFilteredRowModel().rows;
    const selectedRows = filteredRows.filter((row) => row.getIsSelected());
    if (selectedRows.length === 0) return;

    const data = selectedRows.map((row) => ({
      "닉네임(ID)": `${row.original.nickname} (${row.original.nicknameId})`,
      번호: row.original.phone,
      주소: row.original.address,
      "매출액(건수)": `${row.original.revenueAmount.toLocaleString()}원 (${row.original.revenueCount}건)`,
      "취소금액 (건수)": `${row.original.cancelAmount.toLocaleString()}원 (${row.original.cancelCount}건)`,
      "환불금액 (건수)": `${row.original.refundAmount.toLocaleString()}원 (${row.original.refundCount}건)`,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "매출 상세");

    const fileName = `매출상세_${new Date().toISOString().split("T")[0]}.xlsx`;
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
    <div className="space-y-4">
      <div className="overflow-hidden rounded-md border">
        <DataTableWithSelection table={table} rowSelection={rowSelection} />
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
  );
}
