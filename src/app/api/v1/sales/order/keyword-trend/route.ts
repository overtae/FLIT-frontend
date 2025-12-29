import { NextRequest, NextResponse } from "next/server";

import { generateOrderKeywordTrend } from "@/data/sales";
import { fetchWithAuth } from "@/lib/api/client";
import { USE_MOCK_DATA } from "@/lib/api/config";

export async function GET(request: NextRequest) {
  try {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return NextResponse.json(generateOrderKeywordTrend());
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const params = new URLSearchParams();
    if (period) params.append("period", period);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const queryString = params.toString();
    const endpoint = queryString ? `/sales/order/keyword-trend?${queryString}` : "/sales/order/keyword-trend";

    const response = await fetchWithAuth(endpoint);

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch keyword trend" }, { status: 500 });
  }
}
