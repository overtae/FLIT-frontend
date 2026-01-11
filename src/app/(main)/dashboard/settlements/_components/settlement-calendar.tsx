"use client";

import { useState, useMemo, useEffect } from "react";

import {
  format,
  isSameDay,
  isToday,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SettlementCalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  settlementDates: Date[];
  currentYear: number;
  currentMonth: number;
  onMonthChange: (year: number, month: number) => void;
  className?: string;
}

export function SettlementCalendar({
  selectedDate,
  onDateSelect,
  settlementDates,
  currentYear,
  currentMonth: currentMonthNum,
  onMonthChange,
  className,
}: SettlementCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => new Date(currentYear, currentMonthNum - 1, 1));

  const daysInMonth = useMemo(
    () =>
      eachDayOfInterval({
        start: startOfWeek(startOfMonth(currentMonth)),
        end: endOfWeek(endOfMonth(currentMonth)),
      }),
    [currentMonth],
  );

  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  // Sync currentMonth with props
  useEffect(() => {
    const newMonth = new Date(currentYear, currentMonthNum - 1, 1);
    const currentMonthStr = format(currentMonth, "yyyy-MM");
    const newMonthStr = format(newMonth, "yyyy-MM");
    if (currentMonthStr !== newMonthStr) {
      setCurrentMonth(newMonth);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentYear, currentMonthNum]);

  const prevMonth = () => {
    const newMonth = subMonths(currentMonth, 1);
    setCurrentMonth(newMonth);
    onMonthChange(newMonth.getFullYear(), newMonth.getMonth() + 1);
  };

  const nextMonth = () => {
    const newMonth = addMonths(currentMonth, 1);
    setCurrentMonth(newMonth);
    onMonthChange(newMonth.getFullYear(), newMonth.getMonth() + 1);
  };

  const settlementDatesSet = useMemo(() => {
    return new Set(settlementDates.map((date) => format(date, "yyyy-MM-dd")));
  }, [settlementDates]);

  const isSettlementDate = (date: Date) => {
    return settlementDatesSet.has(format(date, "yyyy-MM-dd"));
  };

  return (
    <div className={cn("mx-auto flex w-full flex-col gap-3 p-2 sm:gap-4 sm:p-4", className)}>
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={prevMonth} className="h-7 w-7 sm:h-8 sm:w-8">
          <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </Button>
        <span className="text-sm font-semibold sm:text-base md:text-lg">{format(currentMonth, "yyyy년 M월")}</span>
        <Button variant="ghost" size="icon" onClick={nextMonth} className="h-7 w-7 sm:h-8 sm:w-8">
          <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </Button>
      </div>

      <div className="grid flex-1 grid-cols-7 gap-0.5 sm:gap-1">
        {weekDays.map((day) => (
          <div key={day} className="flex items-center justify-center text-[10px] font-medium text-gray-500 sm:text-xs">
            {day}
          </div>
        ))}

        {daysInMonth.map((date) => {
          const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
          const isCurrentDay = isToday(date);
          const hasSettlement = isSettlementDate(date);
          const dateKey = format(date, "yyyy-MM-dd");

          return (
            <button
              key={dateKey}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDateSelect(date);
              }}
              className={cn(
                "relative mx-auto flex aspect-square h-auto w-fit flex-col items-center justify-center rounded-full px-2 text-xs transition-colors sm:px-3 sm:text-sm",
                isCurrentDay && "border-main text-main border",
                !isCurrentDay && "hover:bg-main/10",
                isSelected && "bg-main hover:bg-main/80 font-semibold text-white",
                !isSelected && !isCurrentDay && "text-gray-700",
              )}
            >
              <span>{format(date, "d")}</span>
              {hasSettlement && (
                <div className="absolute top-0.5 left-1/2 h-0.5 w-0.5 -translate-x-1/2 rounded-full bg-red-500 sm:top-1 sm:h-1 sm:w-1" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
