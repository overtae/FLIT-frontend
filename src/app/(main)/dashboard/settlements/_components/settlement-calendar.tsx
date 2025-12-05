"use client";

import { useState } from "react";

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
  className?: string;
}

export function SettlementCalendar({
  selectedDate,
  onDateSelect,
  settlementDates,
  className,
}: SettlementCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth)),
  });

  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const isSettlementDate = (date: Date) => {
    return settlementDates.some((settlementDate) => isSameDay(settlementDate, date));
  };

  return (
    <div className={cn("mx-auto flex w-full flex-col gap-4 p-4", className)}>
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-lg font-semibold">{format(currentMonth, "yyyy년 M월")}</span>
        <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid flex-1 grid-cols-7 gap-1">
        {weekDays.map((day) => (
          <div key={day} className="flex items-center justify-center p-2 text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}

        {daysInMonth.map((date) => {
          const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
          const isCurrentDay = isToday(date);
          const hasSettlement = isSettlementDate(date);

          return (
            <button
              key={date.toISOString()}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDateSelect(date);
              }}
              className={cn(
                "relative flex aspect-2/1 h-auto w-full flex-col items-center justify-center rounded-lg text-sm transition-colors",
                isCurrentDay && "bg-main rounded-full text-white",
                !isCurrentDay && "hover:bg-gray-100",
                isSelected && !isCurrentDay && "bg-gray-200 font-semibold",
                !isSelected && !isCurrentDay && "text-gray-700",
              )}
            >
              <span>{format(date, "d")}</span>
              {hasSettlement && (
                <div className="absolute top-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-red-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
