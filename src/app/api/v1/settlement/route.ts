import { NextRequest, NextResponse } from "next/server";

import { mockSettlements } from "@/data/settlement";
import { fetchWithAuth } from "@/lib/api/client";
import { USE_MOCK_DATA } from "@/lib/api/config";

export async function GET(request: NextRequest) {
  try {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const { searchParams } = new URL(request.url);
      const type = searchParams.get("type") ?? "ALL";

      let filtered = [...mockSettlements];
      if (type !== "ALL") {
        filtered = filtered.filter((s) => {
          if (type === "SHOP") return s.loginId.startsWith("shop");
          if (type === "FLORIST") return s.loginId.startsWith("florist");
          return true;
        });
      }

      return NextResponse.json(filtered);
    }

    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page");
    const size = searchParams.get("size");
    const period = searchParams.get("period") ?? "ONE_WEEK";
    const type = searchParams.get("type") ?? "ALL";
    const year = searchParams.get("year");
    const month = searchParams.get("month");

    const params = new URLSearchParams();
    if (page) params.append("page", page);
    if (size) params.append("size", size);
    params.append("period", period);
    params.append("type", type);
    if (year) params.append("year", year);
    if (month) params.append("month", month);

    const queryString = params.toString();
    const endpoint = queryString ? `/settlement?${queryString}` : "/settlement";

    const response = await fetchWithAuth(endpoint);

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settlements" }, { status: 500 });
  }
}
