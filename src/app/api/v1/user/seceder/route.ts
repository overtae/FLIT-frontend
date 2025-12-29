import { NextRequest, NextResponse } from "next/server";

import { mockSecederUsers } from "@/data/user";
import { fetchWithAuth } from "@/lib/api/client";
import { USE_MOCK_DATA } from "@/lib/api/config";

export async function GET(request: NextRequest) {
  try {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return NextResponse.json(mockSecederUsers);
    }

    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page");
    const size = searchParams.get("size");
    const type = searchParams.get("type") ?? "ALL";
    const name = searchParams.get("name");
    const secedeDate = searchParams.get("secedeDate");

    const params = new URLSearchParams();
    if (page) params.append("page", page);
    if (size) params.append("size", size);
    params.append("type", type);
    if (name) params.append("name", name);
    if (secedeDate) params.append("secedeDate", secedeDate);

    const queryString = params.toString();
    const endpoint = queryString ? `/user/seceder?${queryString}` : "/user/seceder";

    const response = await fetchWithAuth(endpoint);

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch seceder users" }, { status: 500 });
  }
}
