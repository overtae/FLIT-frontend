"use client";

import { useMemo, useEffect, useState } from "react";

import { useSearchParams } from "next/navigation";

import * as XLSX from "@e965/xlsx";
import { Download } from "lucide-react";

import { productColumns } from "@/app/(main)/dashboard/sales/products/_components/columns.product";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableWithSelection } from "@/components/data-table/data-table-with-selection";
import { Button } from "@/components/ui/button";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { getSalesDetails } from "@/service/sales.service";
import { SalesDetail } from "@/types/dashboard";

export function SalesDetailTable() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [salesDetails, setSalesDetails] = useState<SalesDetail[]>([]);

  const pageIndex = parseInt(searchParams.get("page") ?? "1", 10) - 1;
  const pageSize = parseInt(searchParams.get("pageSize") ?? "10", 10);

  useEffect(() => {
    const fetchSalesDetails = async () => {
      try {
        setIsLoading(true);
        const response = await getSalesDetails({
          page: pageIndex + 1,
          pageSize,
          search: searchParams.get("search") ?? undefined,
          categories: searchParams.get("categories") ?? undefined,
          paymentMethods: searchParams.get("paymentMethods") ?? undefined,
          regions: searchParams.get("regions") ?? undefined,
          orderStatuses: searchParams.get("orderStatuses") ?? undefined,
          today: searchParams.get("today") === "true",
          dateFrom: searchParams.get("dateFrom") ?? undefined,
          dateTo: searchParams.get("dateTo") ?? undefined,
        });

        setSalesDetails(response.data);
        setTotal(response.total);
      } catch (error) {
        console.error("Failed to fetch sales details:", error);
        setTotal(0);
        setSalesDetails([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSalesDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, pageSize, searchParams.toString()]);

  const columns = useMemo(() => productColumns, []);

  const { table, rowSelection } = useDataTableInstance({
    data: salesDetails,
    columns,
    getRowId: (row) => row.id,
    manualPagination: true,
    pageCount: total > 0 ? Math.ceil(total / pageSize) : 0,
    defaultPageIndex: pageIndex,
    defaultPageSize: pageSize,
  });

  const handleDownloadAll = () => {
    const filteredRows = table.getFilteredRowModel().rows;
    const selectedRows = filteredRows.filter((row) => row.getIsSelected());
    if (selectedRows.length === 0) return;

    const data = selectedRows.map((row) => ({
      이름: row.original.name,
      "닉네임(ID)": `${row.original.nickname} (${row.original.nicknameId})`,
      번호: row.original.phone,
      주소: row.original.address,
      상품명: row.original.productName,
      금액: `${row.original.amount.toLocaleString()}원`,
      결제방법: row.original.paymentMethod,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "판매 상세");

    const fileName = `판매상세_${new Date().toISOString().split("T")[0]}.xlsx`;
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
    <div className="min-h-screen space-y-4">
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
