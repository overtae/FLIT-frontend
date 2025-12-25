import { ScheduleEvent } from "@/types/dashboard";
import { ScheduleItem, ScheduleCalendarDate } from "@/types/schedules";

export async function getSchedules(params?: { date?: string }): Promise<{
  data: ScheduleItem[];
  total: number;
}> {
  const searchParams = new URLSearchParams();
  if (params?.date) {
    searchParams.append("date", params.date);
  }

  const response = await fetch(`/api/dashboard/schedules?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch schedules");
  }

  return response.json();
}

export async function getScheduleCalendarDates(): Promise<{
  data: ScheduleCalendarDate[];
  total: number;
}> {
  const response = await fetch("/api/dashboard/schedules");
  if (!response.ok) {
    throw new Error("Failed to fetch schedule calendar dates");
  }

  return response.json();
}

export async function getScheduleEvents(): Promise<ScheduleEvent[]> {
  const response = await fetch("/api/dashboard/schedules?events=true");
  if (!response.ok) {
    throw new Error("Failed to fetch schedule events");
  }

  const data = await response.json();
  return data.map((event: Omit<ScheduleEvent, "date"> & { date: string }) => ({
    ...event,
    date: new Date(event.date),
  }));
}
