import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = [
      { day: "Sun", thisWeek: 35000000, lastWeek: 32000000 },
      { day: "Mon", thisWeek: 38000000, lastWeek: 35000000 },
      { day: "Tue", thisWeek: 40000000, lastWeek: 37000000 },
      { day: "Wed", thisWeek: 39000000, lastWeek: 36000000 },
      { day: "Thu", thisWeek: 42000000, lastWeek: 39000000 },
      { day: "Fri", thisWeek: 41000000, lastWeek: 38000000 },
      { day: "Sat", thisWeek: 37000000, lastWeek: 34000000 },
    ];

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch weekly sales chart data" }, { status: 500 });
  }
}
