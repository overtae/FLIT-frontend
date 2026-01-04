import { NextRequest, NextResponse } from "next/server";

import { fetchWithAuth } from "@/lib/api/client";
import { SOCIAL_LOGIN, TOKEN_COOKIE_OPTIONS, USE_MOCK_DATA } from "@/lib/api/config";

interface GoogleCallbackBody {
  code: string;
  state: string | null;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as GoogleCallbackBody;

    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const accessToken = "mock-google-access-token";
      const refreshToken = "mock-google-refresh-token";

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

    const googleUserInfo = await fetchGoogleUserInfo(access_token);
    if (!googleUserInfo) {
      return NextResponse.json({ error: "Failed to fetch Google user info" }, { status: 400 });
    }

    let token: { accessToken: string; refreshToken: string } | undefined;

    try {
      const response = await fetchWithAuth("/auth/social/google", {
        method: "POST",
        body: JSON.stringify({
          accessToken: access_token,
          email: googleUserInfo.email,
          name: googleUserInfo.name,
          picture: googleUserInfo.picture,
          googleId: googleUserInfo.id,
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
    return NextResponse.json({ error: "Failed to process Google login" }, { status: 500 });
  }
}

async function exchangeCodeForToken(code: string) {
  try {
    const clientId = SOCIAL_LOGIN.google.clientId;
    const clientSecret = SOCIAL_LOGIN.google.clientSecret;
    const redirectUri = encodeURIComponent(SOCIAL_LOGIN.google.redirectUri);

    const tokenUrl = "https://oauth2.googleapis.com/token";
    const params = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: SOCIAL_LOGIN.google.redirectUri,
      code,
    });

    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
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

async function fetchGoogleUserInfo(accessToken: string) {
  try {
    const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data as {
      id: string;
      email: string;
      name: string;
      picture?: string;
    };
  } catch {
    return null;
  }
}
