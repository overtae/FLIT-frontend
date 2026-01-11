"use client";

import { useMemo, useState, useEffect, useCallback } from "react";

import { useSearchParams } from "next/navigation";

import * as XLSX from "@e965/xlsx";
import { Download } from "lucide-react";

import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableWithSelection } from "@/components/data-table/data-table-with-selection";
import { Button } from "@/components/ui/button";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { useFilteredPagination } from "@/hooks/use-filtered-pagination";
import { getRevenueDetail } from "@/service/sales.service";
import type { RevenueDetailItem } from "@/types/sales.type";

import { revenueColumns } from "./columns.revenue";

interface RevenueDetailTableProps {
  category: "all" | "shop" | "florist" | "order";
}

export function RevenueDetailTable({ category }: RevenueDetailTableProps) {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [allRevenueDetails, setAllRevenueDetails] = useState<RevenueDetailItem[]>([]);

  const urlPage = useMemo(() => {
    const pageParam = searchParams.get("page");
    return pageParam ? parseInt(pageParam, 10) - 1 : 0;
  }, [searchParams]);
  const urlPageSize = useMemo(() => {
    const pageSizeParam = searchParams.get("pageSize");
    return pageSizeParam ? parseInt(pageSizeParam, 10) : 10;
  }, [searchParams]);

  useEffect(() => {
    const fetchRevenueDetails = async () => {
      try {
        setIsLoading(true);
        const params: Parameters<typeof getRevenueDetail>[0] = {};

        if (category !== "all") {
          params.category = category as any;
        } else {
          params.category = "ALL";
        }

        const data = await getRevenueDetail(params);
        setAllRevenueDetails(data);
      } catch (error) {
        console.error("Failed to fetch revenue details:", error);
        setAllRevenueDetails([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRevenueDetails();
  }, [category]);

  const getRegionFromAddress = useCallback((address: string): string => {
    if (address.includes("서울")) return "서울";
    if (address.includes("경기")) return "경기";
    if (address.includes("인천")) return "인천";
    return "기타";
  }, []);

  const filterFn = useMemo(
    () => (item: RevenueDetailItem) => {
      const search = searchParams.get("search");
      if (search && search.trim()) {
        const searchLower = search.toLowerCase();
        const matchesSearch =
          item.nickname.toLowerCase().includes(searchLower) || item.loginId.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      const filterCategories = searchParams.get("categories");
      if (filterCategories && filterCategories !== "전체") {
        const categoryMap: Record<string, "FLOWER" | "PLANTS" | "WREATH" | "SCENOGRAPHY" | "REGULAR_DELIVERY"> = {
          꽃: "FLOWER",
          식물: "PLANTS",
          화환: "WREATH",
          공간연출: "SCENOGRAPHY",
          정기배송: "REGULAR_DELIVERY",
        };
        const categories = filterCategories.split(",").filter((c) => c !== "전체");
        if (categories.length > 0) {
          const mappedCategories = categories
            .map((c) => categoryMap[c])
            .filter((c): c is "FLOWER" | "PLANTS" | "WREATH" | "SCENOGRAPHY" | "REGULAR_DELIVERY" => !!c);
          if (mappedCategories.length > 0 && item.category && !mappedCategories.includes(item.category)) {
            return false;
          }
        }
      }

      const filterPaymentMethods = searchParams.get("paymentMethods");
      if (filterPaymentMethods && filterPaymentMethods !== "전체") {
        const paymentMethodMap: Record<string, "CARD" | "CASH" | "BANK_TRANSFER" | "ETC"> = {
          카드: "CARD",
          POS: "CARD",
          현금: "CASH",
          "계좌 이체": "BANK_TRANSFER",
          기타: "ETC",
        };
        const methods = filterPaymentMethods.split(",").filter((m) => m !== "전체");
        if (methods.length > 0) {
          const mappedMethods = methods
            .map((m) => paymentMethodMap[m])
            .filter((m): m is "CARD" | "CASH" | "BANK_TRANSFER" | "ETC" => !!m);
          if (mappedMethods.length > 0 && item.paymentMethod && !mappedMethods.includes(item.paymentMethod)) {
            return false;
          }
        }
      }

      const filterRegions = searchParams.get("regions");
      if (filterRegions && filterRegions !== "전체") {
        const regions = filterRegions.split(",").filter((r) => r !== "전체");
        if (regions.length > 0) {
          const itemRegion = getRegionFromAddress(item.address);
          if (!regions.includes(itemRegion)) return false;
        }
      }

      const filterOrderStatuses = searchParams.get("orderStatuses");
      if (filterOrderStatuses && filterOrderStatuses !== "전체") {
        const statusMap: Record<string, "REGISTER" | "PROGRESS" | "COMPLETED" | "CANCELED"> = {
          접수: "REGISTER",
          배송중: "PROGRESS",
          배송완료: "COMPLETED",
          주문취소: "CANCELED",
        };
        const statuses = filterOrderStatuses.split(",").filter((s) => s !== "전체");
        if (statuses.length > 0) {
          const mappedStatuses = statuses
            .map((s) => statusMap[s])
            .filter((s): s is "REGISTER" | "PROGRESS" | "COMPLETED" | "CANCELED" => !!s);
          if (mappedStatuses.length > 0 && item.status && !mappedStatuses.includes(item.status)) {
            return false;
          }
        }
      }

      const dateFrom = searchParams.get("dateFrom");
      const dateTo = searchParams.get("dateTo");
      if (dateFrom && dateTo && item.orderDate) {
        const orderDate = new Date(item.orderDate);
        const fromDate = new Date(dateFrom);
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999);
        if (orderDate < fromDate || orderDate > toDate) {
          return false;
        }
      }

      return true;
    },
    [searchParams, getRegionFromAddress],
  );

  const { paginatedData, pageCount, pageIndex, pageSize, setPageIndex, setPageSize, resetPagination } =
    useFilteredPagination({
      data: allRevenueDetails,
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
        search: searchParams.get("search"),
        categories: searchParams.get("categories"),
        paymentMethods: searchParams.get("paymentMethods"),
        regions: searchParams.get("regions"),
        orderStatuses: searchParams.get("orderStatuses"),
        dateFrom: searchParams.get("dateFrom"),
        dateTo: searchParams.get("dateTo"),
        pageIndex,
      }),
    [searchParams, pageIndex],
  );

  const columns = useMemo(() => revenueColumns, []);

  const { table, rowSelection } = useDataTableInstance({
    data: paginatedData,
    columns,
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
    const filteredRows = table.getFilteredRowModel().rows;
    const selectedRows = filteredRows.filter((row) => row.getIsSelected());
    if (selectedRows.length === 0) return;

    const data = selectedRows.map((row) => ({
      "닉네임(ID)": `${row.original.nickname} (${row.original.loginId})`,
      번호: row.original.phoneNumber,
      주소: row.original.address,
      매출액: `${row.original.salesAmount.toLocaleString()}원`,
      취소금액: `${row.original.canceledAmount.toLocaleString()}원`,
      환불금액: `${row.original.refundAmount.toLocaleString()}원`,
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
    <div className="flex min-h-full flex-col space-y-4">
      <div className="flex-1 rounded-md">
        <DataTableWithSelection table={table} rowSelection={rowSelection} filterKey={filterKey} />
      </div>
      <div className="border-t px-4 py-4">
        <DataTablePagination
          table={table}
          pageCount={pageCount}
          forceUpdateKey={filterKey}
          leftSlot={
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadAll}
              disabled={Object.keys(rowSelection).length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              전체 다운로드
            </Button>
          }
        />
      </div>
    </div>
  );
}
