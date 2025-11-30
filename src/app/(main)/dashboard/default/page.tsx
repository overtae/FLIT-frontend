"use client";

import { useState, useMemo } from "react";

import { isSameDay } from "date-fns";

import { ScheduleCalendar } from "./_components/schedule-calendar";
import { mockScheduleEvents } from "./_components/schedule-data";
import { ScheduleTimeline } from "./_components/schedule-timeline";

export default function Page() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date(2025, 11, 13));

  const datesWithEvents = useMemo(() => {
    return mockScheduleEvents.map((event) => event.date);
  }, []);

  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return [];
    return mockScheduleEvents.filter((event) => isSameDay(event.date, selectedDate));
  }, [selectedDate]);

  return (
    <div className="flex h-[calc(100vh-9rem)] flex-col gap-6">
      <h1 className="text-2xl font-semibold">일정관리</h1>
      <div className="grid h-full flex-1 grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex h-full flex-col overflow-hidden">
          <ScheduleCalendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            datesWithEvents={datesWithEvents}
          />
        </div>
        <div className="flex h-full flex-col overflow-hidden pb-16">
          <ScheduleTimeline events={selectedDateEvents} selectedDate={selectedDate} />
        </div>
      </div>
    </div>
  );
}
