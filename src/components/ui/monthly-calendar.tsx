"use client";

import { useState } from "react";

import { endOfMonth, format, startOfMonth } from "date-fns";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { DateRange } from "react-day-picker";

import { Button, buttonVariants } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface MonthlyCalendarProps {
  selectedMonth?: DateRange;
  onMonthSelect: (range: DateRange) => void;
  placeholder?: string;
  buttonClassName?: string;
}

const MONTHS = [
  "1월", "2월", "3월", "4월", "5월", "6월",
  "7월", "8월", "9월", "10월", "11월", "12월",
];

export function MonthlyCalendar({
  selectedMonth,
  onMonthSelect,
  placeholder = "월 선택",
  buttonClassName,
}: MonthlyCalendarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [displayYear, setDisplayYear] = useState(
    selectedMonth?.from?.getFullYear() ?? new Date().getFullYear()
  );

  const selectedMonthIndex = selectedMonth?.from
    ? selectedMonth.from.getMonth()
    : undefined;

  const getDisplayText = () => {
    if (selectedMonth?.from) {
      return format(selectedMonth.from, "yyyy년 M월");
    }
    return placeholder;
  };

  const handleMonthClick = (monthIndex: number) => {
    const monthStart = startOfMonth(new Date(displayYear, monthIndex, 1));
    const monthEnd = endOfMonth(monthStart);
    onMonthSelect({ from: monthStart, to: monthEnd });
    setIsOpen(false);
  };

  const handleYearChange = (delta: number) => {
    setDisplayYear((prev) => prev + delta);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={buttonClassName ?? "w-[150px] justify-start text-left font-normal"}
        >
          {getDisplayText()}
          <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleYearChange(-1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-lg font-semibold">{displayYear}</div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleYearChange(1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {MONTHS.map((month, index) => {
              const isSelected = selectedMonthIndex === index;
              return (
                <Button
                  key={month}
                  variant={isSelected ? "default" : "outline"}
                  className={cn(
                    "h-10 w-20",
                    isSelected && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => handleMonthClick(index)}
                >
                  {month}
                </Button>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

