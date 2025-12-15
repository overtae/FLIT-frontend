"use client";

import { useState, useMemo, useEffect } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subWeeks } from "date-fns";
import { Download, Search, Filter } from "lucide-react";
import * as XLSX from "xlsx";

import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableWithSelection } from "@/components/data-table/data-table-with-selection";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { getSettlements } from "@/service/settlement.service";
import { Settlement } from "@/types/dashboard";

import { SettlementCalendar } from "./settlement-calendar";
import { createSettlementColumns } from "./settlement-columns";

const getSettlementDates = (settlements: Settlement[]): Date[] => {
  const dateSet = new Set<string>();
  settlements.forEach((settlement) => {
    dateSet.add(settlement.settlementDate);
  });
  return Array.from(dateSet)
    .map((dateStr) => {
      const [year, month, day] = dateStr.split("-").map(Number);
      return new Date(year, month - 1, day);
    })
    .sort((a, b) => a.getTime() - b.getTime());
};

const getDateRangeForPeriod = (period: "1week" | "2week" | "month"): { start: Date; end: Date } => {
  const now = new Date();
  switch (period) {
    case "1week":
      return {
        start: startOfWeek(now),
        end: endOfWeek(now),
      };
    case "2week":
      return {
        start: startOfWeek(subWeeks(now, 1)),
        end: endOfWeek(now),
      };
    case "month":
      return {
        start: startOfMonth(now),
        end: endOfMonth(now),
      };
  }
};

export function SettlementList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedPeriod, setSelectedPeriod] = useState<"1week" | "2week" | "month">("1week");
  const [selectedTypes, setSelectedTypes] = useState<("shop" | "florist")[]>(["shop", "florist"]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [search, setSearch] = useState("");
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [total, setTotal] = useState(0);
  const pageIndex = parseInt(searchParams.get("page") ?? "1", 10) - 1;
  const pageSize = parseInt(searchParams.get("pageSize") ?? "10", 10);

  const dateRange = useMemo(() => getDateRangeForPeriod(selectedPeriod), [selectedPeriod]);

  useEffect(() => {
    const fetchSettlements = async () => {
      try {
        setIsLoading(true);
        const params: {
          type?: string;
          settlementDate?: string;
          page?: number;
          pageSize?: number;
        } = {
          page: pageIndex + 1,
          pageSize,
        };

        if (selectedTypes.length === 1) {
          params.type = selectedTypes[0];
        }

        if (selectedDate) {
          params.settlementDate = format(selectedDate, "yyyy-MM-dd");
        }

        const response = await getSettlements(params);
        setSettlements(response.data);
        setTotal(response.total);
      } catch (error) {
        console.error("Failed to fetch settlements:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettlements();
  }, [pageIndex, pageSize, selectedTypes, selectedDate, dateRange]);

  const settlementDates = useMemo(() => {
    return getSettlementDates(settlements);
  }, [settlements]);

  const handleDownload = (settlement: Settlement) => {
    const data = [
      ["닉네임(ID)", "번호", "mail", "총매출", "수수료", "수수료 제외", "배달료", "상태"],
      [
        `${settlement.nickname} (${settlement.nicknameId})`,
        settlement.phone,
        settlement.email,
        settlement.totalRevenue.toString(),
        settlement.commission.toString(),
        settlement.revenueExcludingCommission.toString(),
        settlement.deliveryFee.toString(),
        settlement.status,
      ],
    ];

    const csvContent = data.map((row) => row.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `정산_${settlement.nickname}_${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = () => {
    const filteredRows = table.getFilteredRowModel().rows;
    const selectedRows = filteredRows.filter((row) => row.getIsSelected());
    if (selectedRows.length === 0) return;

    const data = selectedRows.map((row) => ({
      "닉네임(ID)": `${row.original.nickname} (${row.original.nicknameId})`,
      번호: row.original.phone,
      mail: row.original.email,
      총매출: row.original.totalRevenue.toLocaleString(),
      수수료: row.original.commission.toLocaleString(),
      "수수료 제외": row.original.revenueExcludingCommission.toLocaleString(),
      배달료: row.original.deliveryFee.toLocaleString(),
      상태: row.original.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "정산 목록");

    const fileName = `정산목록_${format(new Date(), "yyyy-MM-dd")}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const handleRowClick = (settlement: Settlement) => {
    router.push(`/dashboard/settlements/${settlement.id}`);
  };

  const columns = useMemo(() => createSettlementColumns({ onDownload: handleDownload }), []);

  const { table, rowSelection } = useDataTableInstance({
    data: settlements,
    columns,
    getRowId: (row) => row.id,
    manualPagination: true,
    pageCount: Math.ceil(total / pageSize),
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

  const handleTypeToggle = (type: "shop" | "florist") => {
    setSelectedTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-6">
          <Tabs
            value={selectedPeriod}
            onValueChange={(value) => {
              setSelectedPeriod(value as "1week" | "2week" | "month");
              setSelectedDate(null);
            }}
          >
            <TabsList>
              <TabsTrigger value="1week">1week</TabsTrigger>
              <TabsTrigger value="2week">2week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-4">
            <Checkbox
              id="shop"
              checked={selectedTypes.includes("shop")}
              onCheckedChange={() => handleTypeToggle("shop")}
            />
            <label htmlFor="shop" className="cursor-pointer text-sm font-medium">
              shop
            </label>
            <Checkbox
              id="florist"
              checked={selectedTypes.includes("florist")}
              onCheckedChange={() => handleTypeToggle("florist")}
            />
            <label htmlFor="florist" className="cursor-pointer text-sm font-medium">
              florist
            </label>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative max-w-sm flex-1">
              <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
              <Input
                placeholder="검색..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              필터
            </Button>
          </div>
        </div>

        <div className="h-full">
          <SettlementCalendar
            selectedDate={selectedDate}
            onDateSelect={(date) => {
              setSelectedDate(date);
            }}
            settlementDates={settlementDates}
            className="h-full"
          />
        </div>
      </div>

      <div className="w-full space-y-4">
        <div className="overflow-hidden rounded-md border">
          <DataTableWithSelection table={table} rowSelection={rowSelection} onRowClick={handleRowClick} />
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
    </div>
  );
}
