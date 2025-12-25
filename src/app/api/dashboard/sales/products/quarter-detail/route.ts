import { NextRequest, NextResponse } from "next/server";

import { generateQuarterProductDetailData } from "@/data/sales";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const year = searchParams.get("year") ?? new Date().getFullYear().toString();
    const quarter = searchParams.get("quarter");

    const data = generateQuarterProductDetailData(year, quarter ?? undefined);

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch quarter product detail data" }, { status: 500 });
  }
}
