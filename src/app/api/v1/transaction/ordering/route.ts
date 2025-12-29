import { NextRequest, NextResponse } from "next/server";

import { mockTransactions } from "@/data/transaction";
import { fetchWithAuth } from "@/lib/api/client";
import { USE_MOCK_DATA } from "@/lib/api/config";

export async function GET(request: NextRequest) {
  try {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return NextResponse.json(mockTransactions);
    }

    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page");
    const size = searchParams.get("size");
    const paymentDate = searchParams.get("paymentDate");
    const paymentMethod = searchParams.get("paymentMethod");

    const params = new URLSearchParams();
    if (page) params.append("page", page);
    if (size) params.append("size", size);
    if (paymentDate) params.append("paymentDate", paymentDate);
    if (paymentMethod) params.append("paymentMethod", paymentMethod);

    const queryString = params.toString();
    const endpoint = queryString ? `/transaction/ordering?${queryString}` : "/transaction/ordering";

    const response = await fetchWithAuth(endpoint);

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch ordering transactions" }, { status: 500 });
  }
}
