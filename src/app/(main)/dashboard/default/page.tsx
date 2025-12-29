"use client";

import { useState, useMemo, useEffect, useRef } from "react";

import { format, parseISO } from "date-fns";

import { getSchedules } from "@/service/schedule.service";
import type { Schedule } from "@/types/schedule.type";

import { ScheduleCalendar } from "./_components/schedule-calendar";
import { ScheduleTimeline } from "./_components/schedule-timeline";

export default function Page() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const previousYearMonthRef = useRef<{ year: number; month: number } | null>(null);

  useEffect(() => {
    const fetchSchedules = async (year: number, month: number) => {
      try {
        const data = await getSchedules({
          year: year.toString(),
          month: month.toString(),
        });
        setSchedules(data);
      } catch (error) {
        console.error("Failed to fetch schedules:", error);
      }
    };

    const currentYear = currentMonth.getFullYear();
    const currentMonthNumber = currentMonth.getMonth() + 1;

    const previous = previousYearMonthRef.current;
    if (!previous || previous.year !== currentYear || previous.month !== currentMonthNumber) {
      previousYearMonthRef.current = { year: currentYear, month: currentMonthNumber };
      fetchSchedules(currentYear, currentMonthNumber);
    }
  }, [currentMonth]);

  const schedulesByDate = useMemo(() => {
    const map = new Map<string, Schedule[]>();
    schedules.forEach((schedule) => {
      const dateKey = schedule.targetDate;
      const existing = map.get(dateKey) ?? [];
      map.set(dateKey, [...existing, schedule]);
    });
    return map;
  }, [schedules]);

  const datesWithEvents = useMemo(() => {
    return Array.from(schedulesByDate.entries())
      .filter(([, scheduleArray]) => scheduleArray.length > 0)
      .map(([dateKey]) => parseISO(dateKey));
  }, [schedulesByDate]);

  const selectedDateSchedules = useMemo(() => {
    if (!selectedDate) return [];
    const dateKey = format(selectedDate, "yyyy-MM-dd");
    return schedulesByDate.get(dateKey) ?? [];
  }, [selectedDate, schedulesByDate]);

  return (
    <div className="flex h-[calc(100vh-9rem)] flex-col gap-6">
      <h1 className="text-2xl font-semibold">일정관리</h1>
      <div className="grid h-full flex-1 grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex h-full flex-col overflow-hidden">
          <ScheduleCalendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            datesWithEvents={datesWithEvents}
            currentMonth={currentMonth}
            onMonthChange={setCurrentMonth}
          />
        </div>
        <div className="flex h-full flex-col overflow-hidden pb-16">
          <ScheduleTimeline schedules={selectedDateSchedules} selectedDate={selectedDate} />
        </div>
      </div>
    </div>
  );
}
