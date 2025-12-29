import { NextRequest, NextResponse } from "next/server";

import { fetchWithAuth } from "@/lib/api/client";
import { USE_MOCK_DATA } from "@/lib/api/config";

export async function POST(request: NextRequest) {
  try {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return NextResponse.json({ accessToken: "mock-access-token", refreshToken: "mock-refresh-token" });
    }

    const body = await request.json();
    const response = await fetchWithAuth("/auth/login/google", {
      method: "POST",
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to login with Google" }, { status: 500 });
  }
}
