import { NextRequest, NextResponse } from "next/server";

import { generateProductNetYearly } from "@/data/sales";
import { fetchWithAuth } from "@/lib/api/client";
import { USE_MOCK_DATA } from "@/lib/api/config";
import type { ProductNetYearlyResponse } from "@/types/sales.type";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startYear = searchParams.get("startYear");
    const endYear = searchParams.get("endYear");

    if (!startYear || !endYear) {
      return NextResponse.json({ error: "Missing required parameters: startYear, endYear" }, { status: 400 });
    }

    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const data: ProductNetYearlyResponse[] = generateProductNetYearly(startYear, endYear);
      return NextResponse.json(data);
    }

    const params = new URLSearchParams();
    params.append("startYear", startYear);
    params.append("endYear", endYear);

    const endpoint = `/sales/product/net/yearly?${params.toString()}`;
    const response = await fetchWithAuth(endpoint);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Failed to fetch product yearly net" }));
      return NextResponse.json(errorData, { status: response.status });
    }

    const data: ProductNetYearlyResponse[] = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch product yearly net" }, { status: 500 });
  }
}
