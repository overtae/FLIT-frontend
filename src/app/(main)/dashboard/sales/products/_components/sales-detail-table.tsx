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
import { getProductDetail } from "@/service/sales.service";
import type { ProductDetailItem } from "@/types/sales.type";

export function SalesDetailTable() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [allSalesDetails, setAllSalesDetails] = useState<ProductDetailItem[]>([]);

  const pageIndex = parseInt(searchParams.get("page") ?? "1", 10) - 1;
  const pageSize = parseInt(searchParams.get("pageSize") ?? "10", 10);

  useEffect(() => {
    const fetchSalesDetails = async () => {
      try {
        setIsLoading(true);
        const params: Parameters<typeof getProductDetail>[0] = {};
        if (searchParams.get("page")) params.page = parseInt(searchParams.get("page")!, 10);
        if (searchParams.get("size")) params.size = parseInt(searchParams.get("size")!, 10);
        if (searchParams.get("startDate")) params.startDate = searchParams.get("startDate")!;
        if (searchParams.get("endDate")) params.endDate = searchParams.get("endDate")!;
        if (searchParams.get("category")) params.category = searchParams.get("category") as any;
        if (searchParams.get("paymentMethod")) params.paymentMethod = searchParams.get("paymentMethod") as any;
        if (searchParams.get("region")) params.region = searchParams.get("region") as any;
        if (searchParams.get("status")) params.status = searchParams.get("status") as any;

        const data = await getProductDetail(params);
        setAllSalesDetails(data);
      } catch (error) {
        console.error("Failed to fetch sales details:", error);
        setAllSalesDetails([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSalesDetails();
  }, [searchParams]);

  const filteredData = useMemo(() => {
    let filtered = [...allSalesDetails];

    const search = searchParams.get("search");
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (item) => item.nickname.toLowerCase().includes(searchLower) || item.loginId.toLowerCase().includes(searchLower),
      );
    }

    return filtered;
  }, [allSalesDetails, searchParams]);

  const paginatedData = useMemo(() => {
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    return filteredData.slice(start, end);
  }, [filteredData, pageIndex, pageSize]);

  const total = filteredData.length;
  const pageCount = Math.ceil(total / pageSize);

  const columns = useMemo(() => productColumns, []);

  const { table, rowSelection } = useDataTableInstance({
    data: paginatedData,
    columns,
    getRowId: (row) => row.transactionId.toString(),
    manualPagination: true,
    pageCount,
    defaultPageIndex: pageIndex,
    defaultPageSize: pageSize,
  });

  const handleDownloadAll = () => {
    const filteredRows = table.getFilteredRowModel().rows;
    const selectedRows = filteredRows.filter((row) => row.getIsSelected());
    if (selectedRows.length === 0) return;

    const data = selectedRows.map((row) => ({
      이름: row.original.name,
      "닉네임(ID)": `${row.original.nickname} (${row.original.loginId})`,
      번호: row.original.phoneNumber,
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
