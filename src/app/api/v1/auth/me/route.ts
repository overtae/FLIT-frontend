import { NextRequest, NextResponse } from "next/server";

import { mockUserInfo } from "@/data/auth";
import { fetchWithAuth } from "@/lib/api/client";
import { USE_MOCK_DATA } from "@/lib/api/config";

export async function GET() {
  try {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return NextResponse.json({
        userId: mockUserInfo.userId,
        nickname: mockUserInfo.nickname,
        level: mockUserInfo.level,
      });
    }

    const response = await fetchWithAuth("/auth/me");

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch user info" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return NextResponse.json({ success: true });
    }

    const response = await fetchWithAuth("/auth/me", {
      method: "DELETE",
    });

    if (!response.ok) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
