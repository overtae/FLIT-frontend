import { NextRequest, NextResponse } from "next/server";

import { getSchedulesByMonth } from "@/data/schedule";
import { fetchWithAuth } from "@/lib/api/client";
import { USE_MOCK_DATA } from "@/lib/api/config";

export async function GET(request: NextRequest) {
  try {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const { searchParams } = new URL(request.url);
      const year = searchParams.get("year");
      const month = searchParams.get("month");
      const data = getSchedulesByMonth(year ?? undefined, month ?? undefined);
      return NextResponse.json(data);
    }

    const { searchParams } = new URL(request.url);
    const year = searchParams.get("year");
    const month = searchParams.get("month");

    const params = new URLSearchParams();
    if (year) params.append("year", year);
    if (month) params.append("month", month);

    const queryString = params.toString();
    const endpoint = queryString ? `/schedule?${queryString}` : "/schedule";

    const response = await fetchWithAuth(endpoint);

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch schedule" }, { status: 500 });
  }
}
