"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { SearchInput } from "@/components/ui/search-input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { SettlementPeriod, SettlementStatus } from "@/types/settlement.type";

import { SettlementFilter } from "./settlement-filter";

interface SettlementFiltersProps {
  selectedPeriod: SettlementPeriod;
  onPeriodChange: (period: SettlementPeriod) => void;
  selectedTypes: Array<"SHOP" | "FLORIST">;
  onTypeToggle: (type: "SHOP" | "FLORIST") => void;
  search: string;
  onSearchChange: (value: string) => void;
  onSearchEnter: (value: string) => void;
  selectedStatuses: SettlementStatus[];
  onStatusesChange: (statuses: SettlementStatus[]) => void;
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
}

export function SettlementFilters({
  selectedPeriod,
  onPeriodChange,
  selectedTypes,
  onTypeToggle,
  search,
  onSearchChange,
  onSearchEnter,
  selectedStatuses,
  onStatusesChange,
  selectedDate,
  onDateChange,
}: SettlementFiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <Tabs value={selectedPeriod} onValueChange={(value) => onPeriodChange(value as SettlementPeriod)}>
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="ONE_WEEK" className="flex-1 text-xs sm:flex-initial sm:text-sm">
            1week
          </TabsTrigger>
          <TabsTrigger value="TWO_WEEK" className="flex-1 text-xs sm:flex-initial sm:text-sm">
            2week
          </TabsTrigger>
          <TabsTrigger value="MONTH" className="flex-1 text-xs sm:flex-initial sm:text-sm">
            Month
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex items-center gap-3 sm:gap-4">
        <Checkbox
          id="shop"
          checked={selectedTypes.includes("SHOP")}
          onCheckedChange={() => onTypeToggle("SHOP")}
          className="h-4 w-4 sm:h-5 sm:w-5"
        />
        <label htmlFor="shop" className="cursor-pointer text-xs font-medium sm:text-sm">
          shop
        </label>
        <Checkbox
          id="florist"
          checked={selectedTypes.includes("FLORIST")}
          onCheckedChange={() => onTypeToggle("FLORIST")}
          className="h-4 w-4 sm:h-5 sm:w-5"
        />
        <label htmlFor="florist" className="cursor-pointer text-xs font-medium sm:text-sm">
          florist
        </label>
      </div>

      <div className="flex-1" />

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
        <div className="w-full max-w-sm flex-1 sm:w-auto">
          <SearchInput
            value={search}
            onChange={onSearchChange}
            onEnter={onSearchEnter}
            placeholder="검색"
            iconPosition="right"
            className="w-full"
          />
        </div>
        <SettlementFilter
          selectedStatuses={selectedStatuses}
          onStatusesChange={onStatusesChange}
          selectedDate={selectedDate}
          onDateChange={onDateChange}
        />
      </div>
    </div>
  );
}
