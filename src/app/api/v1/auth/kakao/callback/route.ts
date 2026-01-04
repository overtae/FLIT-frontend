import { NextRequest, NextResponse } from "next/server";

import { fetchWithAuth } from "@/lib/api/client";
import { SOCIAL_LOGIN, TOKEN_COOKIE_OPTIONS, USE_MOCK_DATA } from "@/lib/api/config";

interface KakaoCallbackBody {
  code: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as KakaoCallbackBody;

    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const accessToken = "mock-kakao-access-token";
      const refreshToken = "mock-kakao-refresh-token";

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

    const kakaoUserInfo = await fetchKakaoUserInfo(access_token);
    if (!kakaoUserInfo) {
      return NextResponse.json({ error: "Failed to fetch Kakao user info" }, { status: 400 });
    }

    let token: { accessToken: string; refreshToken: string } | undefined;

    try {
      const response = await fetchWithAuth("/auth/social/kakao", {
        method: "POST",
        body: JSON.stringify({
          accessToken: access_token,
          email: kakaoUserInfo.kakao_account?.email,
          nickname: kakaoUserInfo.kakao_account?.profile?.nickname,
          kakaoId: kakaoUserInfo.id.toString(),
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
    return NextResponse.json({ error: "Failed to process Kakao login" }, { status: 500 });
  }
}

async function exchangeCodeForToken(code: string) {
  try {
    const clientId = SOCIAL_LOGIN.kakao.clientId;
    const clientSecret = process.env.KAKAO_CLIENT_SECRET ?? "";
    const redirectUri = SOCIAL_LOGIN.kakao.redirectUri;

    const tokenUrl = "https://kauth.kakao.com/oauth/token";
    const params = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code,
    });

    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      body: params.toString(),
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

async function fetchKakaoUserInfo(accessToken: string) {
  try {
    const response = await fetch("https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data as {
      id: number;
      kakao_account?: {
        email?: string;
        profile?: {
          nickname?: string;
        };
      };
    };
  } catch {
    return null;
  }
}
