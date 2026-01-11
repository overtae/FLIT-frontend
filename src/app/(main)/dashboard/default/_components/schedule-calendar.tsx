"use client";

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
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  className?: string;
}

export function ScheduleCalendar({
  selectedDate,
  onDateSelect,
  datesWithEvents,
  currentMonth,
  onMonthChange,
  className,
}: ScheduleCalendarProps) {
  const daysInMonth = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth)),
  });

  const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const prevMonth = () => onMonthChange(subMonths(currentMonth, 1));
  const nextMonth = () => onMonthChange(addMonths(currentMonth, 1));

  const isDateWithEvent = (date: Date) => {
    return datesWithEvents.some((eventDate) => isSameDay(eventDate, date));
  };

  const getDayCellClassName = (date: Date) => {
    const isToday = isSameDay(date, new Date());
    const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
    const isCurrentMonth = isSameMonth(date, currentMonth);

    return cn(
      "group relative flex aspect-square w-full flex-col items-center justify-center rounded-lg sm:rounded-2xl text-sm sm:text-base md:text-lg transition-all",
      "bg-white shadow-[2px_2px_10px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 hover:shadow-md",
      !isCurrentMonth && "text-gray-200",
      isCurrentMonth && "text-gray-500",
      isSelected && "z-10 border-2 border-red-400 text-gray-800 shadow-md",
      !isSelected && "hover:bg-gray-50",
      isToday && "bg-primary/10 text-primary hover:bg-primary/20",
    );
  };

  const getEventBulletClassName = (date: Date) => {
    const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
    const isCurrentMonth = isSameMonth(date, currentMonth);

    return cn(
      "absolute top-1 right-1 h-1 w-1 rounded-full bg-red-400 opacity-80 sm:top-2 sm:right-2 sm:h-1.5 sm:w-1.5",
      isSelected && "bg-red-500",
      !isCurrentMonth && "opacity-30",
    );
  };

  const renderDayCell = (date: Date) => {
    const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
    const hasEvent = isDateWithEvent(date);

    return (
      <button key={date.toISOString()} onClick={() => onDateSelect(date)} className={getDayCellClassName(date)}>
        <span className={cn("z-10 font-normal", isSelected && "font-semibold")}>{format(date, "d")}</span>
        {hasEvent && <div className={getEventBulletClassName(date)} />}
      </button>
    );
  };

  return (
    <div className={cn("flex w-full flex-col gap-3 p-2 sm:gap-6 sm:p-4", className)}>
      <div className="flex items-center justify-center gap-3 sm:gap-8">
        <button onClick={prevMonth} className="text-gray-400 transition-colors hover:text-gray-900">
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
        <span className="text-base font-medium text-gray-700 sm:text-lg md:text-xl">{format(currentMonth, "M월")}</span>
        <button onClick={nextMonth} className="text-gray-400 transition-colors hover:text-gray-900">
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
      </div>

      <div className="grid w-full grid-cols-7 gap-1.5 sm:gap-2 md:gap-3 lg:gap-4">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-[10px] font-medium text-gray-400 sm:text-xs">
            {day}
          </div>
        ))}

        {daysInMonth.map(renderDayCell)}
      </div>
    </div>
  );
}
