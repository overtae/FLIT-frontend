import { NextRequest, NextResponse } from "next/server";

import { fetchWithAuth } from "@/lib/api/client";
import { USE_MOCK_DATA, TOKEN_COOKIE_OPTIONS } from "@/lib/api/config";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body as { password: string };

    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const expectedPassword = process.env.PASSWORD;
      if (!expectedPassword || password !== expectedPassword) {
        return NextResponse.json({ error: "비밀번호가 일치하지 않습니다." }, { status: 401 });
      }

      const verificationToken = "mock-verification-token";
      const response = NextResponse.json({ success: true, verificationToken });

      if (body.page) {
        const cookieName = `pageVerification_${body.page}`;
        response.cookies.set(cookieName, "true", TOKEN_COOKIE_OPTIONS.pageVerification);
      }

      return response;
    }

    const response = await fetchWithAuth("/auth/password-verification", {
      method: "POST",
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    const nextResponse = NextResponse.json(data);

    if (body.page) {
      const cookieName = `pageVerification_${body.page}`;
      nextResponse.cookies.set(cookieName, "true", TOKEN_COOKIE_OPTIONS.pageVerification);
    }

    return nextResponse;
  } catch (error) {
    return NextResponse.json({ error: "Failed to verify password" }, { status: 500 });
  }
}
