import { NextRequest, NextResponse } from "next/server";

import { mockSchedules } from "@/data/schedules";
import { ScheduleEvent } from "@/types/dashboard";
import { ScheduleCalendarDate } from "@/types/schedules";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get("date");
  const events = searchParams.get("events");

  if (events === "true") {
    const today = new Date();
    const scheduleEvents: ScheduleEvent[] = mockSchedules.map((schedule, index) => {
      const [hours, minutes] = schedule.time.split(":").map(Number);
      const eventDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (index % 7), hours, minutes);

      return {
        id: schedule.id,
        date: eventDate,
        time: schedule.time,
        title: schedule.title,
        description: schedule.description,
        type: index % 2 === 0 ? "green" : "orange",
      };
    });

    return NextResponse.json(scheduleEvents);
  }

  if (date) {
    const scheduleDate = new Date(date);
    const daySchedules = mockSchedules.filter((schedule) => {
      const scheduleTime = schedule.time.split(":");
      const scheduleDateObj = new Date(scheduleDate);
      scheduleDateObj.setHours(parseInt(scheduleTime[0]), parseInt(scheduleTime[1]));
      return scheduleDateObj.toDateString() === scheduleDate.toDateString();
    });

    return NextResponse.json({
      data: daySchedules,
      total: daySchedules.length,
    });
  }

  const calendarDates: ScheduleCalendarDate[] = [];
  const dateSet = new Set<string>();

  mockSchedules.forEach((schedule) => {
    const today = new Date();
    const [hours, minutes] = schedule.time.split(":").map(Number);
    const scheduleDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes);
    const dateStr = scheduleDate.toISOString().split("T")[0];

    if (!dateSet.has(dateStr)) {
      dateSet.add(dateStr);
      calendarDates.push({
        date: dateStr,
        hasSchedule: true,
      });
    }
  });

  return NextResponse.json({
    data: calendarDates,
    total: calendarDates.length,
  });
}
