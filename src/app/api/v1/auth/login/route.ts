import { NextRequest, NextResponse } from "next/server";

import { fetchWithAuth } from "@/lib/api/client";
import { USE_MOCK_DATA, TOKEN_COOKIE_OPTIONS } from "@/lib/api/config";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { loginId, password } = body as { loginId: string; password: string };

    if (USE_MOCK_DATA) {
      const validLoginId = process.env.LOGIN_ID;
      const validPassword = process.env.PASSWORD;

      if (validLoginId && validPassword) {
        if (loginId !== validLoginId || password !== validPassword) {
          return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
      const accessToken = "mock-access-token";
      const refreshToken = "mock-refresh-token";

      // httpOnly 쿠키로 토큰만 설정, 응답 body는 비움
      const response = NextResponse.json({ success: true });
      response.cookies.set("accessToken", accessToken, TOKEN_COOKIE_OPTIONS.accessToken);
      response.cookies.set("refreshToken", refreshToken, TOKEN_COOKIE_OPTIONS.refreshToken);

      return response;
    }
    const response = await fetchWithAuth("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    // 실제 API 응답에서 토큰을 추출하여 쿠키에 설정, 응답 body는 비움
    const { token } = data as { token?: { accessToken: string; refreshToken: string } };
    const nextResponse = NextResponse.json({ success: true });

    if (token) {
      nextResponse.cookies.set("accessToken", token.accessToken, TOKEN_COOKIE_OPTIONS.accessToken);
      nextResponse.cookies.set("refreshToken", token.refreshToken, TOKEN_COOKIE_OPTIONS.refreshToken);
    }

    return nextResponse;
  } catch {
    return NextResponse.json({ error: "Failed to login" }, { status: 500 });
  }
}
