import { NextResponse } from "next/server";

import { TOKEN_COOKIE_OPTIONS } from "@/lib/api/config";

export async function POST() {
  try {
    const response = NextResponse.json({ success: true });

    // 쿠키 삭제
    response.cookies.set("accessToken", "", {
      ...TOKEN_COOKIE_OPTIONS.accessToken,
      maxAge: 0,
    });
    response.cookies.set("refreshToken", "", {
      ...TOKEN_COOKIE_OPTIONS.refreshToken,
      maxAge: 0,
    });
    response.cookies.set("verificationToken", "", {
      ...TOKEN_COOKIE_OPTIONS.verificationToken,
      maxAge: 0,
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}
