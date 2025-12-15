import { ScheduleEvent } from "@/types/dashboard";

export async function getScheduleEvents(): Promise<ScheduleEvent[]> {
  const response = await fetch("/api/dashboard/schedules");
  if (!response.ok) {
    throw new Error("Failed to fetch schedule events");
  }

  const events = await response.json();
  return events.map((event: ScheduleEvent & { date: string }) => ({
    ...event,
    date: new Date(event.date),
  }));
}
