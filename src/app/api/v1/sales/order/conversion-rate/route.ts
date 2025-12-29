import { NextRequest, NextResponse } from "next/server";

import { generateOrderConversionRate } from "@/data/sales";
import { fetchWithAuth } from "@/lib/api/client";
import { USE_MOCK_DATA } from "@/lib/api/config";

export async function GET(request: NextRequest) {
  try {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return NextResponse.json(generateOrderConversionRate());
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period");

    const params = new URLSearchParams();
    if (period) params.append("period", period);

    const queryString = params.toString();
    const endpoint = queryString ? `/sales/order/conversion-rate?${queryString}` : "/sales/order/conversion-rate";

    const response = await fetchWithAuth(endpoint);

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch conversion rate" }, { status: 500 });
  }
}
