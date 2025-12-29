import { NextRequest, NextResponse } from "next/server";

import { generateOrderCvr } from "@/data/sales";
import { fetchWithAuth } from "@/lib/api/client";
import { USE_MOCK_DATA } from "@/lib/api/config";
import type { OrderCvrResponse } from "@/types/sales.type";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const mockStartDate = startDate ?? new Date().toISOString().split("T")[0];
      const mockEndDate = endDate ?? new Date().toISOString().split("T")[0];

      const data: OrderCvrResponse[] = generateOrderCvr(mockStartDate, mockEndDate);
      return NextResponse.json(data);
    }

    if (!period || !startDate || !endDate) {
      return NextResponse.json({ error: "Missing required parameters: period, startDate, endDate" }, { status: 400 });
    }

    const params = new URLSearchParams();
    params.append("period", period);
    params.append("startDate", startDate);
    params.append("endDate", endDate);

    const endpoint = `/sales/order/cvr?${params.toString()}`;
    const response = await fetchWithAuth(endpoint);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Failed to fetch CVR" }));
      return NextResponse.json(errorData, { status: response.status });
    }

    const data: OrderCvrResponse[] = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch CVR" }, { status: 500 });
  }
}
