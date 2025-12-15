"use client";

import { useState, useMemo, useEffect } from "react";

import { isSameDay } from "date-fns";

import { getScheduleEvents } from "@/service/schedule.service";
import { ScheduleEvent } from "@/types/dashboard";

import { ScheduleCalendar } from "./_components/schedule-calendar";
import { ScheduleTimeline } from "./_components/schedule-timeline";

export default function Page() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [scheduleEvents, setScheduleEvents] = useState<ScheduleEvent[]>([]);

  useEffect(() => {
    const fetchScheduleEvents = async () => {
      try {
        const events = await getScheduleEvents();
        setScheduleEvents(events);
      } catch (error) {
        console.error("Failed to fetch schedule events:", error);
      }
    };

    fetchScheduleEvents();
  }, []);

  const datesWithEvents = useMemo(() => {
    return scheduleEvents.map((event) => event.date);
  }, [scheduleEvents]);

  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return [];
    return scheduleEvents.filter((event) => isSameDay(event.date, selectedDate));
  }, [selectedDate, scheduleEvents]);

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
