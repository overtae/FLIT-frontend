"use client";

import * as React from "react";

import { Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SERVICE_CONFIG } from "@/config/service-config";

interface UserFilterProps {
  category?: string;
  selectedGrades: string[];
  onGradesChange: (grades: string[]) => void;
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
}

export function UserFilter({
  category = "all",
  selectedGrades,
  onGradesChange,
  selectedDate,
  onDateChange,
}: UserFilterProps) {
  const [dateEnabled, setDateEnabled] = React.useState(!!selectedDate);

  const gradeEntries = React.useMemo(() => {
    if (category === "customer" || category === "all") {
      return Object.entries(SERVICE_CONFIG.customerGrade);
    }
    return Object.entries(SERVICE_CONFIG.grade);
  }, [category]);

  const toggleGrade = (gradeKey: string) => {
    const newGrades = selectedGrades.includes(gradeKey)
      ? selectedGrades.filter((g) => g !== gradeKey)
      : [...selectedGrades, gradeKey];
    onGradesChange(newGrades);
  };

  const handleReset = () => {
    onGradesChange([]);
    setDateEnabled(false);
    onDateChange(undefined);
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
            {gradeEntries.map(([gradeKey, gradeLabel]) => (
              <div key={gradeKey} className="flex items-center space-x-2">
                <Checkbox
                  id={`filter-${gradeKey}`}
                  checked={selectedGrades.includes(gradeKey)}
                  onCheckedChange={() => toggleGrade(gradeKey)}
                />
                <Label
                  htmlFor={`filter-${gradeKey}`}
                  className="cursor-pointer text-sm leading-none font-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {gradeLabel}
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
                    onDateChange(undefined);
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
                selected={selectedDate}
                onSelect={(newDate) => {
                  onDateChange(newDate);
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
