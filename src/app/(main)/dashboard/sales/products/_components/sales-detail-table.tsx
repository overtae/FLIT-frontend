"use client";

import { useMemo, useState, useEffect, useCallback } from "react";

import { useSearchParams } from "next/navigation";

import * as XLSX from "@e965/xlsx";
import { Download } from "lucide-react";

import { productColumns } from "@/app/(main)/dashboard/sales/products/_components/columns.product";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableWithSelection } from "@/components/data-table/data-table-with-selection";
import { Button } from "@/components/ui/button";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { useFilteredPagination } from "@/hooks/use-filtered-pagination";
import { getProductDetail } from "@/service/sales.service";
import type { ProductDetailItem } from "@/types/sales.type";

interface SalesDetailTableProps {
  category: "all" | "flower" | "plant" | "wreath" | "space" | "subscription";
}

export function SalesDetailTable({ category }: SalesDetailTableProps) {
  const searchParams = useSearchParams();
  const urlPage = useMemo(() => {
    const pageParam = searchParams.get("page");
    return pageParam ? parseInt(pageParam, 10) - 1 : 0;
  }, [searchParams]);
  const urlPageSize = useMemo(() => {
    const pageSizeParam = searchParams.get("pageSize");
    return pageSizeParam ? parseInt(pageSizeParam, 10) : 10;
  }, [searchParams]);

  const [isLoading, setIsLoading] = useState(true);
  const [allSalesDetails, setAllSalesDetails] = useState<ProductDetailItem[]>([]);

  const search = useMemo(() => searchParams.get("search") ?? "", [searchParams]);

  useEffect(() => {
    const fetchSalesDetails = async () => {
      try {
        setIsLoading(true);
        const params: Parameters<typeof getProductDetail>[0] = {};

        if (category !== "all") {
          const categoryMap: Record<string, "FLOWER" | "PLANTS" | "WREATH" | "SCENOGRAPHY" | "REGULAR_DELIVERY"> = {
            flower: "FLOWER",
            plant: "PLANTS",
            wreath: "WREATH",
            space: "SCENOGRAPHY",
            subscription: "REGULAR_DELIVERY",
          };
          params.category = categoryMap[category];
        } else {
          params.category = "ALL";
        }

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
  }, [category]);

  const getRegionFromAddress = useCallback((address: string): string => {
    if (address.includes("서울")) return "서울";
    if (address.includes("경기")) return "경기";
    if (address.includes("인천")) return "인천";
    return "기타";
  }, []);

  const filterFn = useMemo(
    () => (item: ProductDetailItem) => {
      if (search.trim()) {
        const searchLower = search.toLowerCase();
        const matchesSearch =
          item.nickname.toLowerCase().includes(searchLower) ||
          item.loginId.toLowerCase().includes(searchLower) ||
          item.name.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      const filterCategories = searchParams.get("categories");
      if (filterCategories && filterCategories !== "전체") {
        const categoryMap: Record<string, string> = {
          꽃: "FLOWER",
          식물: "PLANTS",
          화환: "WREATH",
          공간연출: "SCENOGRAPHY",
          정기배송: "REGULAR_DELIVERY",
        };
        const productCategoryMap: Record<string, string[]> = {
          FLOWER: ["장미 꽃다발", "튤립 꽃다발", "꽃바구니"],
          PLANTS: ["동양난", "서양난"],
          WREATH: ["화환"],
          SCENOGRAPHY: ["공간연출"],
          REGULAR_DELIVERY: ["정기배송"],
        };
        const categories = filterCategories.split(",").filter((c) => c !== "전체");
        if (categories.length > 0) {
          const mappedCategories = categories
            .map((c) => categoryMap[c])
            .filter((c): c is string => !!c)
            .flatMap((c) => productCategoryMap[c] || []);
          if (mappedCategories.length > 0 && !mappedCategories.includes(item.productName)) {
            return false;
          }
        }
      }

      const filterPaymentMethods = searchParams.get("paymentMethods");
      if (filterPaymentMethods && filterPaymentMethods !== "전체") {
        const paymentMethodMap: Record<string, string> = {
          카드: "CARD",
          현금: "CASH",
          계좌이체: "BANK_TRANSFER",
          기타: "ETC",
        };
        const methods = filterPaymentMethods.split(",").filter((m) => m !== "전체");
        if (methods.length > 0) {
          const mappedMethods = methods.map((m) => paymentMethodMap[m]).filter((m): m is string => !!m);
          if (mappedMethods.length > 0 && !mappedMethods.includes(item.paymentMethod)) {
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
    [search, searchParams, getRegionFromAddress],
  );

  const { paginatedData, pageCount, pageIndex, pageSize, setPageIndex, setPageSize, resetPagination } =
    useFilteredPagination({
      data: allSalesDetails,
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
        categories: searchParams.get("categories"),
        paymentMethods: searchParams.get("paymentMethods"),
        regions: searchParams.get("regions"),
        orderStatuses: searchParams.get("orderStatuses"),
        dateFrom: searchParams.get("dateFrom"),
        dateTo: searchParams.get("dateTo"),
        pageIndex,
      }),
    [search, searchParams, pageIndex],
  );

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

  useEffect(() => {
    table.setPagination({ pageIndex, pageSize });
  }, [table, pageIndex, pageSize]);

  const handleDownloadAll = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
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
