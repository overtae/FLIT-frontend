import { NextRequest, NextResponse } from "next/server";

import { mockSettlementDetails } from "@/data/settlement";
import { fetchWithAuth } from "@/lib/api/client";
import { USE_MOCK_DATA } from "@/lib/api/config";

export async function GET(request: NextRequest, { params }: { params: Promise<{ settlementId: string }> }) {
  try {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const { settlementId } = await params;
      const id = parseInt(settlementId, 10);
      if (isNaN(id)) {
        return NextResponse.json({ error: "Invalid settlement ID" }, { status: 400 });
      }
      const settlement = mockSettlementDetails[id];
      if (!settlement) {
        return NextResponse.json({ error: "Settlement not found" }, { status: 404 });
      }
      return NextResponse.json(settlement);
    }

    const { settlementId } = await params;
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page");
    const size = searchParams.get("size");
    const paymentDate = searchParams.get("paymentDate");
    const paymentMethod = searchParams.get("paymentMethod");

    const urlParams = new URLSearchParams();
    if (page) urlParams.append("page", page);
    if (size) urlParams.append("size", size);
    if (paymentDate) urlParams.append("paymentDate", paymentDate);
    if (paymentMethod) urlParams.append("paymentMethod", paymentMethod);

    const queryString = urlParams.toString();
    const endpoint = queryString ? `/settlement/${settlementId}?${queryString}` : `/settlement/${settlementId}`;

    const response = await fetchWithAuth(endpoint);

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settlement" }, { status: 500 });
  }
}
