import { NextRequest, NextResponse } from "next/server";

import { generateRevenueDashboardData } from "@/data/sales";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const dateParam = searchParams.get("date");

    const date = dateParam ? new Date(dateParam) : undefined;
    const data = generateRevenueDashboardData(date);

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch revenue dashboard data" }, { status: 500 });
  }
}
