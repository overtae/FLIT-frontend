"use client";

import * as React from "react";

import { Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SettlementStatus } from "@/types/settlements-monthly";

const statusLabels: Record<SettlementStatus, string> = {
  pending: "대기중",
  completed: "완료",
  cancelled: "취소",
};

interface SettlementFilterProps {
  selectedStatuses: SettlementStatus[];
  onStatusesChange: (statuses: SettlementStatus[]) => void;
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
}

export function SettlementFilter({
  selectedStatuses,
  onStatusesChange,
  selectedDate,
  onDateChange,
}: SettlementFilterProps) {
  const [dateEnabled, setDateEnabled] = React.useState(selectedDate !== null);
  const [date, setDate] = React.useState<Date | undefined>(selectedDate ?? undefined);

  React.useEffect(() => {
    setDate(selectedDate ?? undefined);
    setDateEnabled(selectedDate !== null);
  }, [selectedDate]);

  const toggleStatus = (status: SettlementStatus) => {
    const newStatuses = selectedStatuses.includes(status)
      ? selectedStatuses.filter((s) => s !== status)
      : [...selectedStatuses, status];
    onStatusesChange(newStatuses);
  };

  const handleReset = () => {
    onStatusesChange([]);
    setDateEnabled(false);
    setDate(undefined);
    onDateChange(null);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Settings2 className="text-muted-foreground h-4 w-4" />
          <span className="sr-only">필터 설정</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-h-[80vh] w-[280px] overflow-y-auto p-4" align="end">
        <div className="space-y-4">
          <div className="space-y-3">
            {(["pending", "completed", "cancelled"] as SettlementStatus[]).map((status) => (
              <div key={status} className="flex items-center space-x-2">
                <Checkbox
                  id={`filter-${status}`}
                  checked={selectedStatuses.includes(status)}
                  onCheckedChange={() => toggleStatus(status)}
                />
                <Label
                  htmlFor={`filter-${status}`}
                  className="cursor-pointer text-sm leading-none font-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {statusLabels[status] ?? status}
                </Label>
              </div>
            ))}
            <div className="mt-2 flex items-center space-x-2 border-t pt-1">
              <Checkbox
                id="filter-date"
                checked={dateEnabled}
                onCheckedChange={(checked) => {
                  const newEnabled = !!checked;
                  setDateEnabled(newEnabled);
                  if (!newEnabled) {
                    setDate(undefined);
                    onDateChange(null);
                  }
                }}
              />
              <Label htmlFor="filter-date" className="cursor-pointer text-sm font-normal">
                날짜선택
              </Label>
            </div>
          </div>

          {dateEnabled && (
            <div className="rounded-md border shadow-sm">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => {
                  setDate(newDate);
                  if (newDate) {
                    onDateChange(newDate);
                  }
                }}
                initialFocus
                className="p-2"
              />
            </div>
          )}

          <div className="flex flex-col gap-2 pt-2">
            <Button
              onClick={handleReset}
              className="h-8 w-full rounded-full bg-gray-600 text-xs text-white hover:bg-gray-700"
            >
              Reset
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
