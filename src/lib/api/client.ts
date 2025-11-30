import { cookies } from "next/headers";

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

export async function getPasswordVerified(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get("passwordVerified")?.value === "true";
}

export async function setPasswordVerified(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("passwordVerified", "true", TOKEN_COOKIE_OPTIONS.passwordVerified);
}

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const accessToken = await getAccessToken();

  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    cache: "no-store",
  });
}
