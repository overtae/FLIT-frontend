import { NextRequest, NextResponse } from "next/server";

import { mockCanceledTransactions } from "@/data/transaction";
import { fetchWithAuth } from "@/lib/api/client";
import { USE_MOCK_DATA } from "@/lib/api/config";

export async function GET(request: NextRequest) {
  try {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return NextResponse.json(mockCanceledTransactions);
    }

    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page");
    const size = searchParams.get("size");
    const type = searchParams.get("type") ?? "ALL";
    const status = searchParams.get("status");
    const orderDate = searchParams.get("orderDate");

    const params = new URLSearchParams();
    if (page) params.append("page", page);
    if (size) params.append("size", size);
    params.append("type", type);
    if (status) params.append("status", status);
    if (orderDate) params.append("orderDate", orderDate);

    const queryString = params.toString();
    const endpoint = queryString ? `/transaction/canceled?${queryString}` : "/transaction/canceled";

    const response = await fetchWithAuth(endpoint);

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch canceled transactions" }, { status: 500 });
  }
}
