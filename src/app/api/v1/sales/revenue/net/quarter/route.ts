import { NextRequest, NextResponse } from "next/server";

import { generateRevenueNetQuarter } from "@/data/sales";
import { fetchWithAuth } from "@/lib/api/client";
import { USE_MOCK_DATA } from "@/lib/api/config";

export async function GET(request: NextRequest) {
  try {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const { searchParams } = new URL(request.url);
      const targetYear = searchParams.get("targetYear") ?? new Date().getFullYear().toString();

      return NextResponse.json(generateRevenueNetQuarter(targetYear));
    }

    const { searchParams } = new URL(request.url);
    const targetYear = searchParams.get("targetYear");

    const params = new URLSearchParams();
    if (targetYear) params.append("targetYear", targetYear);

    const queryString = params.toString();
    const endpoint = queryString ? `/sales/revenue/net/quarter?${queryString}` : "/sales/revenue/net/quarter";

    const response = await fetchWithAuth(endpoint);

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch quarter net revenue" }, { status: 500 });
  }
}
