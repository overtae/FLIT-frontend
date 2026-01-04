import { NextRequest, NextResponse } from "next/server";

import { fetchWithAuth } from "@/lib/api/client";
import { SOCIAL_LOGIN, TOKEN_COOKIE_OPTIONS, USE_MOCK_DATA } from "@/lib/api/config";

interface NaverCallbackBody {
  code: string;
  state: string | null;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as NaverCallbackBody;

    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const accessToken = "mock-naver-access-token";
      const refreshToken = "mock-naver-refresh-token";

      const response = NextResponse.json({ success: true });
      response.cookies.set("accessToken", accessToken, TOKEN_COOKIE_OPTIONS.accessToken);
      response.cookies.set("refreshToken", refreshToken, TOKEN_COOKIE_OPTIONS.refreshToken);

      return response;
    }

    const tokenResponse = await exchangeCodeForToken(body.code);
    if (!tokenResponse) {
      return NextResponse.json({ error: "Failed to exchange code for token" }, { status: 400 });
    }

    const { access_token } = tokenResponse;

    const naverUserInfo = await fetchNaverUserInfo(access_token);
    if (!naverUserInfo) {
      return NextResponse.json({ error: "Failed to fetch Naver user info" }, { status: 400 });
    }

    let token: { accessToken: string; refreshToken: string } | undefined;

    try {
      const response = await fetchWithAuth("/auth/social/naver", {
        method: "POST",
        body: JSON.stringify({
          accessToken: access_token,
          email: naverUserInfo.email,
          nickname: naverUserInfo.nickname,
          naverId: naverUserInfo.id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        token = data.token;
      }
    } catch {
      // 백엔드 API가 없거나 실패해도 계속 진행
    }

    const nextResponse = NextResponse.json({ success: true });

    if (token) {
      nextResponse.cookies.set("accessToken", token.accessToken, TOKEN_COOKIE_OPTIONS.accessToken);
      nextResponse.cookies.set("refreshToken", token.refreshToken, TOKEN_COOKIE_OPTIONS.refreshToken);
    } else {
      nextResponse.cookies.set("accessToken", access_token, TOKEN_COOKIE_OPTIONS.accessToken);
      if (tokenResponse.refresh_token) {
        nextResponse.cookies.set("refreshToken", tokenResponse.refresh_token, TOKEN_COOKIE_OPTIONS.refreshToken);
      }
    }

    return nextResponse;
  } catch (error) {
    return NextResponse.json({ error: "Failed to process Naver login" }, { status: 500 });
  }
}

async function exchangeCodeForToken(code: string) {
  try {
    const clientId = SOCIAL_LOGIN.naver.clientId;
    const clientSecret = SOCIAL_LOGIN.naver.clientSecret;
    const redirectUri = encodeURIComponent(SOCIAL_LOGIN.naver.redirectUri);

    const tokenUrl = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${clientId}&client_secret=${clientSecret}&redirect_uri=${redirectUri}&code=${code}`;

    const response = await fetch(tokenUrl, {
      method: "GET",
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data as { access_token: string; refresh_token?: string; token_type: string; expires_in: number };
  } catch {
    return null;
  }
}

async function fetchNaverUserInfo(accessToken: string) {
  try {
    const response = await fetch("https://openapi.naver.com/v1/nid/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.response as { id: string; email: string; nickname: string };
  } catch {
    return null;
  }
}
