"use client";

import { Search } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SettlementPeriod, SettlementType, SettlementStatus } from "@/types/settlements-monthly";

import { SettlementFilter } from "./settlement-filter";

interface SettlementFiltersProps {
  selectedPeriod: SettlementPeriod;
  onPeriodChange: (period: SettlementPeriod) => void;
  selectedTypes: SettlementType[];
  onTypeToggle: (type: SettlementType) => void;
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
          <TabsTrigger value="1week">1week</TabsTrigger>
          <TabsTrigger value="2week">2week</TabsTrigger>
          <TabsTrigger value="month">Month</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex items-center gap-4">
        <Checkbox id="shop" checked={selectedTypes.includes("shop")} onCheckedChange={() => onTypeToggle("shop")} />
        <label htmlFor="shop" className="cursor-pointer text-sm font-medium">
          shop
        </label>
        <Checkbox
          id="florist"
          checked={selectedTypes.includes("florist")}
          onCheckedChange={() => onTypeToggle("florist")}
        />
        <label htmlFor="florist" className="cursor-pointer text-sm font-medium">
          florist
        </label>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        <div className="relative max-w-sm flex-1">
          <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
          <Input
            placeholder="닉네임 검색..."
            value={search}
            onChange={(e) => {
              onSearchChange(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSearchEnter(e.currentTarget.value);
              }
            }}
            className="pl-8"
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
