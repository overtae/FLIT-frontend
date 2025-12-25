import { NextRequest, NextResponse } from "next/server";

import { generateYearlyRevenueDetailData } from "@/data/sales";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const year = searchParams.get("year") ?? new Date().getFullYear().toString();

    const data = generateYearlyRevenueDetailData(year);

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch yearly revenue detail data" }, { status: 500 });
  }
}
