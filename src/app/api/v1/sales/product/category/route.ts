import { NextRequest, NextResponse } from "next/server";

import { generateProductCategory } from "@/data/sales";
import { fetchWithAuth } from "@/lib/api/client";
import { USE_MOCK_DATA } from "@/lib/api/config";

export async function GET(request: NextRequest) {
  try {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const { searchParams } = new URL(request.url);
      const category = (searchParams.get("category") as "GROUP" | "PRODUCT") ?? "GROUP";

      return NextResponse.json(generateProductCategory(category));
    }

    const { searchParams } = new URL(request.url);
    const targetDate = searchParams.get("targetDate");
    const category = searchParams.get("category");

    const params = new URLSearchParams();
    if (targetDate) params.append("targetDate", targetDate);
    if (category) params.append("category", category);

    const queryString = params.toString();
    const endpoint = queryString ? `/sales/product/category?${queryString}` : "/sales/product/category";

    const response = await fetchWithAuth(endpoint);

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch product category" }, { status: 500 });
  }
}
