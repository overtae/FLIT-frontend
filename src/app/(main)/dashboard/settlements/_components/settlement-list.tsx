"use client";

import { useState, useMemo, useEffect, useCallback } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { format } from "date-fns";
import { Download } from "lucide-react";

import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableWithSelection } from "@/components/data-table/data-table-with-selection";
import { Button } from "@/components/ui/button";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { useFilteredPagination } from "@/hooks/use-filtered-pagination";
import { getSettlements } from "@/service/settlement.service";
import type { Settlement, SettlementListParams, SettlementPeriod, SettlementStatus } from "@/types/settlement.type";

import { SettlementCalendar } from "./settlement-calendar";
import { createSettlementColumns } from "./settlement-columns";
import { downloadSettlement, downloadSettlementsAll } from "./settlement-download";
import { SettlementFilters } from "./settlement-filters";

export function SettlementList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedPeriod, setSelectedPeriod] = useState<SettlementPeriod>("ONE_WEEK");
  const [selectedTypes, setSelectedTypes] = useState<Array<"SHOP" | "FLORIST">>(["SHOP", "FLORIST"]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<SettlementStatus[]>([]);
  const [settlementsMap, setSettlementsMap] = useState<Map<string, Settlement[]>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  const urlYear = searchParams.get("year");
  const urlMonth = searchParams.get("month");
  const urlPeriod = searchParams.get("period") as SettlementPeriod | null;
  const urlType = searchParams.get("type") as "ALL" | "SHOP" | "FLORIST" | null;

  const currentYear = useMemo(() => {
    if (urlYear) return parseInt(urlYear, 10);
    if (typeof window !== "undefined") {
      return new Date().getFullYear();
    }
    return 2025;
  }, [urlYear]);
  const currentMonth = useMemo(() => {
    if (urlMonth) return parseInt(urlMonth, 10);
    if (typeof window !== "undefined") {
      return new Date().getMonth() + 1;
    }
    return 1;
  }, [urlMonth]);

  useEffect(() => {
    if (urlPeriod && ["ONE_WEEK", "TWO_WEEK", "MONTH"].includes(urlPeriod)) {
      setSelectedPeriod(urlPeriod);
    }
  }, [urlPeriod]);

  useEffect(() => {
    if (urlType === "SHOP" || urlType === "FLORIST") {
      setSelectedTypes([urlType]);
    } else {
      setSelectedTypes(["SHOP", "FLORIST"]);
    }
  }, [urlType]);

  const urlPage = useMemo(
    () => (searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) - 1 : 0),
    [searchParams],
  );
  const urlPageSize = useMemo(
    () => (searchParams.get("pageSize") ? parseInt(searchParams.get("pageSize")!, 10) : 10),
    [searchParams],
  );

  const settlementType = useMemo(() => {
    return selectedTypes.length === 1 ? selectedTypes[0] : "ALL";
  }, [selectedTypes]);

  useEffect(() => {
    const fetchSettlements = async () => {
      try {
        setIsLoading(true);
        const params: SettlementListParams = {
          year: currentYear.toString(),
          month: currentMonth.toString().padStart(2, "0"),
          period: selectedPeriod,
          type: settlementType,
        };

        const data = await getSettlements(params);

        const map = new Map<string, Settlement[]>();
        data.forEach((settlement) => {
          const dateKey = settlement.settlementDate.split("T")[0];
          const existing = map.get(dateKey) ?? [];
          map.set(dateKey, [...existing, settlement]);
        });

        setSettlementsMap(map);
      } catch (error) {
        console.error("Failed to fetch settlements:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettlements();
  }, [currentYear, currentMonth, selectedPeriod, settlementType]);

  const allSettlements = useMemo(() => {
    return Array.from(settlementsMap.values()).flat();
  }, [settlementsMap]);

  const settlementDates = useMemo(() => {
    return Array.from(settlementsMap.keys())
      .map((dateStr) => {
        const [year, month, day] = dateStr.split("-").map(Number);
        return new Date(year, month - 1, day);
      })
      .sort((a, b) => a.getTime() - b.getTime());
  }, [settlementsMap]);

  const filterFn = useMemo(
    () => (settlement: Settlement) => {
      if (selectedDate) {
        const dateKey = format(selectedDate, "yyyy-MM-dd");
        const settlementDate = settlement.settlementDate.split("T")[0];
        if (settlementDate !== dateKey) {
          return false;
        }
      }

      if (search) {
        const searchLower = search.toLowerCase();
        const matchesSearch =
          settlement.nickname.toLowerCase().includes(searchLower) ||
          settlement.loginId.toLowerCase().includes(searchLower);
        if (!matchesSearch) {
          return false;
        }
      }

      if (selectedStatuses.length > 0) {
        if (!selectedStatuses.includes(settlement.status)) {
          return false;
        }
      }

      return true;
    },
    [selectedDate, search, selectedStatuses],
  );

  const { paginatedData, pageCount, pageIndex, resetPagination } = useFilteredPagination({
    data: allSettlements,
    filterFn,
    initialPageIndex: urlPage,
    initialPageSize: urlPageSize,
  });

  useEffect(() => {
    resetPagination();
  }, [selectedDate, resetPagination]);

  const filterKey = useMemo(
    () =>
      JSON.stringify({
        search,
        selectedDate: selectedDate?.toISOString(),
        selectedStatuses,
      }),
    [search, selectedDate, selectedStatuses],
  );

  const updateURL = useCallback(
    (year: number, month: number, resetPage = false, period?: SettlementPeriod, type?: "ALL" | "SHOP" | "FLORIST") => {
      const params = new URLSearchParams();
      params.set("year", year.toString());
      params.set("month", month.toString());
      params.set("period", period ?? selectedPeriod);
      params.set("type", type ?? settlementType);
      if (resetPage) {
        params.set("page", "1");
      } else if (urlPage > 0) {
        params.set("page", (urlPage + 1).toString());
      }
      if (urlPageSize !== 10) {
        params.set("pageSize", urlPageSize.toString());
      }
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [urlPage, urlPageSize, router, selectedPeriod, settlementType],
  );

  const handleDownloadAll = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows.map((row) => row.original);
    downloadSettlementsAll(selectedRows);
  };

  const handleRowClick = (settlement: Settlement) => {
    router.push(`/dashboard/settlements/${settlement.settlementId}`);
  };

  const columns = useMemo(() => createSettlementColumns({ onDownload: downloadSettlement }), []);

  const { table, rowSelection } = useDataTableInstance({
    data: paginatedData,
    columns,
    getRowId: (row) => row.settlementId.toString(),
    manualPagination: true,
    pageCount,
    defaultPageIndex: urlPage,
    defaultPageSize: urlPageSize,
  });

  const handleTypeToggle = (type: "SHOP" | "FLORIST") => {
    const newTypes = selectedTypes.includes(type) ? selectedTypes.filter((t) => t !== type) : [...selectedTypes, type];
    setSelectedTypes(newTypes);
    resetPagination();
    const newType = newTypes.length === 1 ? newTypes[0] : "ALL";
    updateURL(currentYear, currentMonth, true, undefined, newType);
  };

  const handlePeriodChange = (period: SettlementPeriod) => {
    setSelectedPeriod(period);
    setSelectedDate(null);
    resetPagination();
    updateURL(currentYear, currentMonth, true, period);
  };

  const handleStatusesChange = (statuses: SettlementStatus[]) => {
    setSelectedStatuses(statuses);
    resetPagination();
    updateURL(currentYear, currentMonth, true, selectedPeriod, settlementType);
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    updateURL(currentYear, currentMonth, true, selectedPeriod, settlementType);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-3">
        <SettlementFilters
          selectedPeriod={selectedPeriod}
          onPeriodChange={handlePeriodChange}
          selectedTypes={selectedTypes}
          onTypeToggle={handleTypeToggle}
          search={searchInput}
          onSearchChange={setSearchInput}
          onSearchEnter={(value) => {
            setSearch(value.trim());
            resetPagination();
            updateURL(currentYear, currentMonth, true, selectedPeriod, settlementType);
          }}
          selectedStatuses={selectedStatuses}
          onStatusesChange={handleStatusesChange}
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
        />

        <div className="h-full min-h-[300px] sm:min-h-0">
          <SettlementCalendar
            selectedDate={selectedDate}
            onDateSelect={handleDateChange}
            settlementDates={settlementDates}
            currentYear={currentYear}
            currentMonth={currentMonth}
            onMonthChange={(year, month) => {
              resetPagination();
              updateURL(year, month, true, selectedPeriod, settlementType);
            }}
            className="h-full"
          />
        </div>
      </div>

      <div className="w-full space-y-3 sm:space-y-4">
        <div className="overflow-x-auto rounded-md border">
          <DataTableWithSelection
            table={table}
            rowSelection={rowSelection}
            onRowClick={handleRowClick}
            filterKey={filterKey}
          />
        </div>
        <DataTablePagination
          table={table}
          forceUpdateKey={`${pageIndex}-${pageCount}`}
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
    </div>
  );
}
