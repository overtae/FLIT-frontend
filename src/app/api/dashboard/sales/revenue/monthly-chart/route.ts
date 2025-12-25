import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = [
      { date: "01", thisMonth: 120000000, lastMonth: 110000000 },
      { date: "05", thisMonth: 130000000, lastMonth: 120000000 },
      { date: "10", thisMonth: 140000000, lastMonth: 130000000 },
      { date: "15", thisMonth: 135000000, lastMonth: 125000000 },
      { date: "20", thisMonth: 145000000, lastMonth: 135000000 },
      { date: "25", thisMonth: 150000000, lastMonth: 140000000 },
      { date: "31", thisMonth: 160000000, lastMonth: 150000000 },
    ];

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch monthly revenue chart data" }, { status: 500 });
  }
}
