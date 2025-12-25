import { NextResponse } from "next/server";

export async function GET() {
  try {
    const quarterlyData = [
      { quarter: "1분기", amount: 700000000 },
      { quarter: "2분기", amount: 780000000 },
      { quarter: "3분기", amount: 850000000 },
      { quarter: "4분기", amount: 820000000 },
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
      yearlyComparisonData,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch yearly revenue chart data" }, { status: 500 });
  }
}
