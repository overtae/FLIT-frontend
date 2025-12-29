import { NextRequest, NextResponse } from "next/server";

import { generateProductNet } from "@/data/sales";
import { fetchWithAuth } from "@/lib/api/client";
import { USE_MOCK_DATA } from "@/lib/api/config";
import type { ProductNetResponse } from "@/types/sales.type";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period");
    const paymentMethod = searchParams.get("paymentMethod") ?? "ALL";
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!period || !startDate || !endDate) {
      return NextResponse.json({ error: "Missing required parameters: period, startDate, endDate" }, { status: 400 });
    }

    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const data: ProductNetResponse = generateProductNet(startDate, endDate, period as "DAILY" | "WEEKLY" | "MONTHLY");
      return NextResponse.json(data);
    }

    const params = new URLSearchParams();
    params.append("period", period);
    params.append("paymentMethod", paymentMethod);
    params.append("startDate", startDate);
    params.append("endDate", endDate);

    const endpoint = `/sales/product/net?${params.toString()}`;
    const response = await fetchWithAuth(endpoint);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Failed to fetch product net" }));
      return NextResponse.json(errorData, { status: response.status });
    }

    const data: ProductNetResponse = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch product net" }, { status: 500 });
  }
}
