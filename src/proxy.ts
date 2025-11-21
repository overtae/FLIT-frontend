import { type NextRequest, NextResponse } from "next/server";

import { API_BASE_URL, API_ENDPOINTS, TOKEN_COOKIE_OPTIONS } from "@/lib/api/config";

const publicPaths = ["/auth/login"];

function redirectToLogin(request: NextRequest, pathname: string) {
  const loginUrl = new URL("/auth/login", request.url);
  loginUrl.searchParams.set("redirect", pathname);
  return NextResponse.redirect(loginUrl);
}

function clearCookiesAndRedirect(request: NextRequest, pathname: string) {
  const response = redirectToLogin(request, pathname);
  response.cookies.delete("accessToken");
  response.cookies.delete("refreshToken");
  return response;
}

function setTokenCookies(response: NextResponse, accessToken: string, refreshToken: string) {
  response.cookies.set("accessToken", accessToken, TOKEN_COOKIE_OPTIONS.accessToken);
  response.cookies.set("refreshToken", refreshToken, TOKEN_COOKIE_OPTIONS.refreshToken);
}

async function tryRefreshToken(request: NextRequest, pathname: string) {
  const refreshToken = request.cookies.get("refreshToken")?.value;
  if (!refreshToken) {
    return clearCookiesAndRedirect(request, pathname);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.refresh}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      return clearCookiesAndRedirect(request, pathname);
    }

    const data = await response.json();
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = data;

    const verifyResponse = await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.me}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${newAccessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!verifyResponse.ok) {
      return clearCookiesAndRedirect(request, pathname);
    }

    const nextResponse = NextResponse.next();
    setTokenCookies(nextResponse, newAccessToken, newRefreshToken);
    nextResponse.headers.set("x-token-refreshed", "true");
    return nextResponse;
  } catch {
    return clearCookiesAndRedirect(request, pathname);
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("accessToken")?.value;

  if (!accessToken) {
    return redirectToLogin(request, pathname);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.me}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok && response.status === 401) {
      return tryRefreshToken(request, pathname);
    }

    if (response.ok) {
      return NextResponse.next();
    }

    return redirectToLogin(request, pathname);
  } catch {
    return redirectToLogin(request, pathname);
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
