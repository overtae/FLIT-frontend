import { NextRequest, NextResponse } from "next/server";

import { generateUserStatisticsTotal } from "@/data/user";
import { fetchWithAuth } from "@/lib/api/client";
import { USE_MOCK_DATA } from "@/lib/api/config";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = (searchParams.get("period") ?? "MONTH") as "WEEK" | "MONTH" | "YEAR";

    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return NextResponse.json(generateUserStatisticsTotal(period));
    }

    const targetDate = searchParams.get("targetDate");
    const type = searchParams.get("type") ?? "ALL";

    const params = new URLSearchParams();
    if (targetDate) params.append("targetDate", targetDate);
    params.append("period", period);
    params.append("type", type);

    const response = await fetchWithAuth(`/user/seceder/statistics/total?${params.toString()}`);

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch seceder statistics" }, { status: 500 });
  }
}
