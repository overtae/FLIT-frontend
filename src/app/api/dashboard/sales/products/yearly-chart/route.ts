import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const yearRange = searchParams.get("yearRange");

    const quarterlyData = [
      { quarter: "1분기", card: 400000000, pos: 200000000, transfer: 100000000 },
      { quarter: "2분기", card: 450000000, pos: 220000000, transfer: 110000000 },
      { quarter: "3분기", card: 500000000, pos: 250000000, transfer: 120000000 },
      { quarter: "4분기", card: 480000000, pos: 240000000, transfer: 115000000 },
    ];

    const yearlyComparisonData = [
      { month: "1월", "2020": 100000000, "2021": 120000000, "2022": 140000000, "2023": 160000000 },
      { month: "2월", "2020": 110000000, "2021": 130000000, "2022": 150000000, "2023": 170000000 },
      { month: "3월", "2020": 120000000, "2021": 140000000, "2022": 160000000, "2023": 180000000 },
      { month: "4월", "2020": 115000000, "2021": 135000000, "2022": 155000000, "2023": 175000000 },
      { month: "5월", "2020": 125000000, "2021": 145000000, "2022": 165000000, "2023": 185000000 },
      { month: "6월", "2020": 130000000, "2021": 150000000, "2022": 170000000, "2023": 190000000 },
    ];

    return NextResponse.json({
      quarterlyData,
      yearlyComparisonData: yearRange ? yearlyComparisonData : yearlyComparisonData,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch yearly sales chart data" }, { status: 500 });
  }
}
