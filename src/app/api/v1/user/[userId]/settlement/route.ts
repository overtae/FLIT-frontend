import { NextRequest, NextResponse } from "next/server";

import { generateUserSettlements } from "@/data/user";
import { fetchWithAuth } from "@/lib/api/client";
import { USE_MOCK_DATA } from "@/lib/api/config";

export async function GET(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const { userId } = await params;
      return NextResponse.json(generateUserSettlements(parseInt(userId)));
    }

    const { userId } = await params;
    const { searchParams } = new URL(request.url);
    const year = searchParams.get("year");
    const month = searchParams.get("month");

    const urlParams = new URLSearchParams();
    if (year) urlParams.append("year", year);
    if (month) urlParams.append("month", month);

    const queryString = urlParams.toString();
    const endpoint = queryString ? `/user/${userId}/settlement?${queryString}` : `/user/${userId}/settlement`;

    const response = await fetchWithAuth(endpoint);

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch user settlement" }, { status: 500 });
  }
}
