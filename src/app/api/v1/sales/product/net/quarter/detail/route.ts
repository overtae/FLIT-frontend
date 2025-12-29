import { NextResponse } from "next/server";

import { generateProductNetQuarterDetail } from "@/data/sales";
import { fetchWithAuth } from "@/lib/api/client";
import { USE_MOCK_DATA } from "@/lib/api/config";

export async function GET() {
  try {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return NextResponse.json(generateProductNetQuarterDetail());
    }

    const response = await fetchWithAuth("/sales/product/net/quarter/detail");

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch product quarter detail" }, { status: 500 });
  }
}
