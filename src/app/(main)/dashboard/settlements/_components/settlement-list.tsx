"use client";

import { useState, useMemo, useEffect, useCallback } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { format } from "date-fns";
import { Download } from "lucide-react";

import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableWithSelection } from "@/components/data-table/data-table-with-selection";
import { Button } from "@/components/ui/button";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { getSettlementsMonthly } from "@/service/settlement-monthly.service";
import { Settlement } from "@/types/dashboard";
import { SettlementPeriod, SettlementType, SettlementStatus } from "@/types/settlements-monthly";

import { SettlementCalendar } from "./settlement-calendar";
import { createSettlementColumns } from "./settlement-columns";
import { downloadSettlement, downloadSettlementsAll } from "./settlement-download";
import { SettlementFilters } from "./settlement-filters";
import { buildSettlementSearchParams, SettlementURLUpdates, SettlementURLState } from "./settlement-url-params";

export function SettlementList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedPeriod, setSelectedPeriod] = useState<SettlementPeriod>(
    (searchParams.get("period") as SettlementPeriod | null | undefined) ?? "1week",
  );
  const [selectedTypes, setSelectedTypes] = useState<SettlementType[]>(() => {
    const types = searchParams.get("types");
    if (types) {
      return types.split(",") as SettlementType[];
    }
    return ["shop", "florist"];
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => {
    const dateParam = searchParams.get("date");
    return dateParam ? new Date(dateParam) : new Date();
  });
  const search = searchParams.get("nickname") ?? "";
  const [searchInput, setSearchInput] = useState(search);
  const [selectedStatuses, setSelectedStatuses] = useState<SettlementStatus[]>(() => {
    const statuses = searchParams.get("statuses");
    if (statuses) {
      return statuses.split(",") as SettlementStatus[];
    }
    return [];
  });
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [settlementDates, setSettlementDates] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [total, setTotal] = useState(0);
  const pageIndex = parseInt(searchParams.get("page") ?? "1", 10) - 1;
  const pageSize = parseInt(searchParams.get("pageSize") ?? "10", 10);

  const currentDate = new Date();
  const currentYear = parseInt(searchParams.get("year") ?? currentDate.getFullYear().toString(), 10);
  const currentMonth = parseInt(searchParams.get("month") ?? (currentDate.getMonth() + 1).toString(), 10);

  const urlState: SettlementURLState = useMemo(
    () => ({
      currentYear,
      currentMonth,
      selectedPeriod,
      selectedTypes,
      selectedDate,
      search,
      selectedStatuses,
      pageIndex,
      pageSize,
    }),
    [
      currentYear,
      currentMonth,
      selectedPeriod,
      selectedTypes,
      selectedDate,
      search,
      selectedStatuses,
      pageIndex,
      pageSize,
    ],
  );

  const updateURL = useCallback(
    (updates: SettlementURLUpdates) => {
      const params = buildSettlementSearchParams(updates, urlState);
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [urlState, router],
  );

  const [allMonthlyData, setAllMonthlyData] = useState<Array<{ date: string; items: Settlement[] }>>([]);

  useEffect(() => {
    const fetchSettlements = async () => {
      try {
        setIsLoading(true);
        // 월 단위로 데이터를 불러오기 위해 period를 제거
        const params = {
          year: currentYear,
          month: currentMonth,
          period: undefined, // 월 단위로 불러오기 위해 period 제거
          type: selectedTypes.length === 1 ? selectedTypes[0] : undefined,
          date: undefined, // 전체 월 데이터를 가져오기 위해 date 제거
          nickname: search ? search : undefined,
          status: selectedStatuses.length === 1 ? selectedStatuses[0] : undefined,
          page: 1,
          pageSize: 1000,
        };

        const response = await getSettlementsMonthly(params);
        setAllMonthlyData(response.data);
      } catch (error) {
        console.error("Failed to fetch settlements:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettlements();
  }, [currentYear, currentMonth, selectedTypes, search, selectedStatuses]);

  useEffect(() => {
    const datesSet = new Set<string>();
    const selectedDateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;

    allMonthlyData.forEach((dateData) => {
      if (dateData.items.length > 0) {
        datesSet.add(dateData.date);
      }
    });

    const dates = Array.from(datesSet)
      .map((dateStr) => {
        const [year, month, day] = dateStr.split("-").map(Number);
        return new Date(year, month - 1, day);
      })
      .sort((a, b) => a.getTime() - b.getTime());

    setSettlementDates(dates);

    let filteredSettlements: Settlement[] = [];
    if (selectedDateStr) {
      const selectedDateData = allMonthlyData.find((d) => d.date === selectedDateStr);
      if (selectedDateData) {
        filteredSettlements = selectedDateData.items;
      }
    }

    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedSettlements = filteredSettlements.slice(startIndex, endIndex);

    setSettlements(paginatedSettlements);
    setTotal(filteredSettlements.length);
  }, [allMonthlyData, selectedDate, pageIndex, pageSize]);

  const handleDownloadAll = () => {
    const filteredRows = table.getFilteredRowModel().rows;
    const selectedRows = filteredRows.filter((row) => row.getIsSelected()).map((row) => row.original);
    downloadSettlementsAll(selectedRows);
  };

  const handleRowClick = (settlement: Settlement) => {
    router.push(`/dashboard/settlements/${settlement.id}`);
  };

  const columns = useMemo(() => createSettlementColumns({ onDownload: downloadSettlement }), []);

  const { table, rowSelection } = useDataTableInstance({
    data: settlements,
    columns,
    getRowId: (row) => row.id,
    manualPagination: true,
    pageCount: Math.ceil(total / pageSize),
    defaultPageIndex: pageIndex,
    defaultPageSize: pageSize,
  });

  const handleTypeToggle = (type: SettlementType) => {
    const newTypes = selectedTypes.includes(type) ? selectedTypes.filter((t) => t !== type) : [...selectedTypes, type];
    setSelectedTypes(newTypes);
    updateURL({ types: newTypes });
  };

  const handlePeriodChange = (period: SettlementPeriod) => {
    setSelectedPeriod(period);
    setSelectedDate(null);
    updateURL({ period, date: null });
  };

  const handleStatusesChange = (statuses: SettlementStatus[]) => {
    setSelectedStatuses(statuses);
    updateURL({ statuses });
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    updateURL({ date });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-2 gap-3">
        <SettlementFilters
          selectedPeriod={selectedPeriod}
          onPeriodChange={handlePeriodChange}
          selectedTypes={selectedTypes}
          onTypeToggle={handleTypeToggle}
          search={searchInput}
          onSearchChange={setSearchInput}
          onSearchEnter={(value) => {
            if (value.trim()) {
              updateURL({ nickname: value.trim() });
            } else {
              updateURL({ nickname: "" });
            }
          }}
          selectedStatuses={selectedStatuses}
          onStatusesChange={handleStatusesChange}
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
        />

        <div className="h-full">
          <SettlementCalendar
            selectedDate={selectedDate}
            onDateSelect={handleDateChange}
            settlementDates={settlementDates}
            currentYear={currentYear}
            currentMonth={currentMonth}
            onMonthChange={(year, month) => {
              updateURL({ year, month });
            }}
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
