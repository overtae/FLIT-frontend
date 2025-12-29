import { NextRequest, NextResponse } from "next/server";

import { mockRevenueDetails } from "@/data/sales";
import { fetchWithAuth } from "@/lib/api/client";
import { USE_MOCK_DATA } from "@/lib/api/config";

export async function GET(request: NextRequest) {
  try {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return NextResponse.json(mockRevenueDetails);
    }

    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page");
    const size = searchParams.get("size");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const category = searchParams.get("category") ?? "ALL";
    const paymentMethod = searchParams.get("paymentMethod") ?? "ALL";
    const region = searchParams.get("region") ?? "ALL";
    const status = searchParams.get("status") ?? "ALL";

    const params = new URLSearchParams();
    if (page) params.append("page", page);
    if (size) params.append("size", size);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    params.append("category", category);
    params.append("paymentMethod", paymentMethod);
    params.append("region", region);
    params.append("status", status);

    const queryString = params.toString();
    const endpoint = queryString ? `/sales/revenue/detail?${queryString}` : "/sales/revenue/detail";

    const response = await fetchWithAuth(endpoint);

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch revenue detail" }, { status: 500 });
  }
}
