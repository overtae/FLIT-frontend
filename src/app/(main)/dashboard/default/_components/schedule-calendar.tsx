"use client";

import { useState } from "react";

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface ScheduleCalendarProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date) => void;
  datesWithEvents: Date[];
  className?: string;
}

export function ScheduleCalendar({ selectedDate, onDateSelect, datesWithEvents, className }: ScheduleCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 11, 1));

  // Generate calendar grid days
  const daysInMonth = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth)),
  });

  const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const isDateWithEvent = (date: Date) => {
    return datesWithEvents.some((eventDate) => isSameDay(eventDate, date));
  };

  return (
    <div className={cn("flex w-full flex-col gap-8 p-4", className)}>
      {/* Calendar Header */}
      <div className="flex items-center justify-center gap-8">
        <button onClick={prevMonth} className="text-gray-400 transition-colors hover:text-gray-900">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <span className="text-xl font-medium text-gray-700">{format(currentMonth, "M월")}</span>
        <button onClick={nextMonth} className="text-gray-400 transition-colors hover:text-gray-900">
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid w-full grid-cols-7 gap-3 sm:gap-4">
        {/* Weekdays Headers */}
        {weekDays.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-gray-400">
            {day}
          </div>
        ))}

        {/* Days Cells */}
        {daysInMonth.map((date) => {
          const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
          const isCurrentMonth = isSameMonth(date, currentMonth);
          const hasEvent = isDateWithEvent(date);

          return (
            <button
              key={date.toISOString()}
              onClick={() => onDateSelect(date)}
              className={cn(
                "group relative flex aspect-square w-full flex-col items-center justify-center rounded-2xl text-lg transition-all",
                // Base Appearance (Soft Neumorphic-like shadow)
                "bg-white shadow-[2px_2px_10px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 hover:shadow-md",
                // Text Colors
                !isCurrentMonth && "text-gray-200",
                isCurrentMonth && "text-gray-500",
                // Selected State
                isSelected && "z-10 border-2 border-red-400 text-gray-800 shadow-md",
                // Hover State (when not selected)
                !isSelected && "hover:bg-gray-50",
              )}
            >
              <span className={cn("z-10 font-normal", isSelected && "font-semibold")}>{format(date, "d")}</span>

              {/* Bullet for events */}
              {hasEvent && (
                <div
                  className={cn(
                    "absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-red-400 opacity-80",
                    isSelected && "bg-red-500",
                    !isCurrentMonth && "opacity-30",
                  )}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
