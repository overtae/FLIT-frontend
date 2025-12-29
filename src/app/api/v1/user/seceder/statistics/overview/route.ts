import { NextResponse } from "next/server";

import { generateUserStatisticsOverview } from "@/data/user";
import { fetchWithAuth } from "@/lib/api/client";
import { USE_MOCK_DATA } from "@/lib/api/config";

export async function GET() {
  try {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return NextResponse.json(generateUserStatisticsOverview());
    }

    const response = await fetchWithAuth("/user/seceder/statistics/overview");

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch seceder overview" }, { status: 500 });
  }
}
