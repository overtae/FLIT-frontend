import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = [
      { time: "00", thisDay: 500000, lastDay: 450000 },
      { time: "06", thisDay: 1200000, lastDay: 1100000 },
      { time: "12", thisDay: 2500000, lastDay: 2300000 },
      { time: "18", thisDay: 3200000, lastDay: 3000000 },
      { time: "24", thisDay: 5000000, lastDay: 4800000 },
    ];

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch daily revenue chart data" }, { status: 500 });
  }
}
