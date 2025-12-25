import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = [
      { month: "1월", thisMonth: 120000000, lastMonth: 110000000 },
      { month: "2월", thisMonth: 130000000, lastMonth: 120000000 },
      { month: "3월", thisMonth: 140000000, lastMonth: 130000000 },
      { month: "4월", thisMonth: 135000000, lastMonth: 125000000 },
      { month: "5월", thisMonth: 145000000, lastMonth: 135000000 },
      { month: "6월", thisMonth: 150000000, lastMonth: 140000000 },
    ];

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch monthly sales chart data" }, { status: 500 });
  }
}
