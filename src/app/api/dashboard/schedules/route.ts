import { NextResponse } from "next/server";

import { mockScheduleEvents } from "@/data/schedules";

export async function GET() {
  const events = mockScheduleEvents.map((event) => ({
    ...event,
    date: event.date.toISOString(),
  }));

  return NextResponse.json(events);
}
