import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = [
      { date: "01", thisWeek: 5000000, lastWeek: 4500000 },
      { date: "02", thisWeek: 5200000, lastWeek: 4800000 },
      { date: "03", thisWeek: 4800000, lastWeek: 4400000 },
      { date: "04", thisWeek: 5500000, lastWeek: 5000000 },
      { date: "05", thisWeek: 5300000, lastWeek: 4900000 },
      { date: "06", thisWeek: 5100000, lastWeek: 4700000 },
      { date: "07", thisWeek: 5400000, lastWeek: 5100000 },
    ];

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch daily sales chart data" }, { status: 500 });
  }
}
