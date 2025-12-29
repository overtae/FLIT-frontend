import { NextRequest, NextResponse } from "next/server";

import { fetchWithAuth } from "@/lib/api/client";
import { USE_MOCK_DATA, TOKEN_COOKIE_OPTIONS } from "@/lib/api/config";

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get("refreshToken")?.value;
    if (!refreshToken) {
      return NextResponse.json({ error: "No refresh token" }, { status: 401 });
    }

    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const newAccessToken = "mock-refreshed-access-token";
      const newRefreshToken = "mock-refreshed-refresh-token";

      const response = NextResponse.json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });

      // httpOnly 쿠키로 토큰 설정
      response.cookies.set("accessToken", newAccessToken, TOKEN_COOKIE_OPTIONS.accessToken);
      response.cookies.set("refreshToken", newRefreshToken, TOKEN_COOKIE_OPTIONS.refreshToken);

      return response;
    }

    const response = await fetchWithAuth("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    // 실제 API 응답에서 토큰을 추출하여 쿠키에 설정
    const { accessToken, refreshToken: newRefreshToken } = data as {
      accessToken: string;
      refreshToken: string;
    };
    const nextResponse = NextResponse.json({ accessToken, refreshToken: newRefreshToken });

    nextResponse.cookies.set("accessToken", accessToken, TOKEN_COOKIE_OPTIONS.accessToken);
    nextResponse.cookies.set("refreshToken", newRefreshToken, TOKEN_COOKIE_OPTIONS.refreshToken);

    return nextResponse;
  } catch {
    return NextResponse.json({ error: "Failed to refresh token" }, { status: 500 });
  }
}
