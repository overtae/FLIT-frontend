import { cookies, headers } from "next/headers";

import { API_BASE_URL, TOKEN_COOKIE_OPTIONS } from "./config";

export async function getAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value;
}

export async function getRefreshToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("refreshToken")?.value;
}

export async function setTokens(accessToken: string, refreshToken: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("accessToken", accessToken, TOKEN_COOKIE_OPTIONS.accessToken);
  cookieStore.set("refreshToken", refreshToken, TOKEN_COOKIE_OPTIONS.refreshToken);
}

export async function clearTokens(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  cookieStore.delete("verificationToken");
}

export async function getVerificationToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("verificationToken")?.value;
}

export async function setVerificationToken(verificationToken: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("verificationToken", verificationToken, TOKEN_COOKIE_OPTIONS.verificationToken);
}

export async function getPageVerification(page: string): Promise<boolean> {
  const cookieStore = await cookies();
  const cookieName = `pageVerification_${page}`;
  return cookieStore.get(cookieName)?.value === "true";
}

export async function setPageVerification(page: string): Promise<void> {
  const cookieStore = await cookies();
  const cookieName = `pageVerification_${page}`;
  cookieStore.set(cookieName, "true", TOKEN_COOKIE_OPTIONS.pageVerification);
}

async function refreshTokenAndRetry(endpoint: string, options: RequestInit): Promise<Response> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    await clearTokens();
    throw new Error("No refresh token available");
  }

  const reqHeaders = await headers();
  const cookie = reqHeaders.get("cookie") ?? "";

  const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      cookie,
    },
    body: JSON.stringify({ refreshToken }),
    cache: "no-store",
  });

  if (!refreshResponse.ok) {
    await clearTokens();
    throw new Error("Failed to refresh token");
  }

  const refreshData = await refreshResponse.json();
  const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshData as {
    accessToken: string;
    refreshToken: string;
  };

  await setTokens(newAccessToken, newRefreshToken);

  const requestHeaders = new Headers(options.headers);
  if (!(options.body instanceof FormData)) {
    requestHeaders.set("Content-Type", "application/json");
  }
  requestHeaders.set("Authorization", `Bearer ${newAccessToken}`);

  const newReqHeaders = await headers();
  const newCookie = newReqHeaders.get("cookie") ?? "";

  return fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...Object.fromEntries(requestHeaders.entries()),
      cookie: newCookie,
    },
    cache: "no-store",
  });
}

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const accessToken = await getAccessToken();
  const reqHeaders = await headers();
  const cookie = reqHeaders.get("cookie") ?? "";

  const requestHeaders = new Headers(options.headers);

  if (!(options.body instanceof FormData)) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (accessToken) {
    requestHeaders.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...Object.fromEntries(requestHeaders.entries()),
      cookie,
    },
    cache: "no-store",
  });

  if (response.status === 401 && accessToken) {
    return refreshTokenAndRetry(endpoint, options);
  }

  return response;
}
