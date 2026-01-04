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
    <div className="flex flex-col gap-6">
      <Tabs value={selectedPeriod} onValueChange={(value) => onPeriodChange(value as SettlementPeriod)}>
        <TabsList>
          <TabsTrigger value="ONE_WEEK">1week</TabsTrigger>
          <TabsTrigger value="TWO_WEEK">2week</TabsTrigger>
          <TabsTrigger value="MONTH">Month</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex items-center gap-4">
        <Checkbox id="shop" checked={selectedTypes.includes("SHOP")} onCheckedChange={() => onTypeToggle("SHOP")} />
        <label htmlFor="shop" className="cursor-pointer text-sm font-medium">
          shop
        </label>
        <Checkbox
          id="florist"
          checked={selectedTypes.includes("FLORIST")}
          onCheckedChange={() => onTypeToggle("FLORIST")}
        />
        <label htmlFor="florist" className="cursor-pointer text-sm font-medium">
          florist
        </label>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        <div className="max-w-sm flex-1">
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
