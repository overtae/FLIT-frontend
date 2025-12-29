import { NextRequest, NextResponse } from "next/server";

import { generateRevenueOverview } from "@/data/sales";
import { fetchWithAuth } from "@/lib/api/client";
import { USE_MOCK_DATA } from "@/lib/api/config";

export async function GET(request: NextRequest) {
  try {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return NextResponse.json(generateRevenueOverview());
    }

    const { searchParams } = new URL(request.url);
    const targetDate = searchParams.get("targetDate");

    const params = new URLSearchParams();
    if (targetDate) params.append("targetDate", targetDate);

    const queryString = params.toString();
    const endpoint = queryString ? `/sales/revenue/overview?${queryString}` : "/sales/revenue/overview";

    const response = await fetchWithAuth(endpoint);

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch revenue overview" }, { status: 500 });
  }
}
