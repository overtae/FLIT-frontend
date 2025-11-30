"use server";

import { redirect } from "next/navigation";

import type { ErrorResponse, RefreshTokenRequest, SignInRequest, SignInResponse, User } from "@/types/auth";

import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  getVerificationToken,
  setPasswordVerified,
  setTokens,
  setVerificationToken,
} from "./client";
import { API_BASE_URL, API_ENDPOINTS } from "./config";

function parseErrorResponse(error: unknown): ErrorResponse {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as { response?: { data?: ErrorResponse } };
    return (
      axiosError.response?.data ?? {
        message: "알 수 없는 오류가 발생했습니다.",
      }
    );
  }
  return {
    message: "알 수 없는 오류가 발생했습니다.",
  };
}

export async function signIn(credentials: SignInRequest) {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.signin}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      return { success: false, error: errorData };
    }

    const data: SignInResponse = await response.json();
    const { accessToken, refreshToken } = data;

    await setTokens(accessToken, refreshToken);

    return { success: true, data: { accessToken, refreshToken } };
  } catch (error) {
    return { success: false, error: parseErrorResponse(error) };
  }
}

export async function signOut() {
  await clearTokens();
  redirect("/auth/login");
}

async function fetchUserInfo(accessToken: string): Promise<Response> {
  return fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.me}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
}

async function retryFetchUserWithRefresh(): Promise<User | null> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    return null;
  }

  const refreshResult = await refreshAccessToken(refreshToken);
  if (!refreshResult.success) {
    return null;
  }

  const accessToken = await getAccessToken();
  if (!accessToken) {
    return null;
  }

  const retryResponse = await fetchUserInfo(accessToken);
  if (!retryResponse.ok) {
    return null;
  }

  return await retryResponse.json();
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return null;
    }

    const response = await fetchUserInfo(accessToken);

    if (!response.ok) {
      if (response.status === 401) {
        return await retryFetchUserWithRefresh();
      }
      return null;
    }

    return await response.json();
  } catch {
    return null;
  }
}

export async function refreshAccessToken(refreshToken: string) {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.refresh}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken } as RefreshTokenRequest),
    });

    if (!response.ok) {
      return { success: false };
    }

    const data: SignInResponse = await response.json();
    const { accessToken, refreshToken: newRefreshToken } = data;

    await setTokens(accessToken, newRefreshToken);

    return { success: true, data };
  } catch {
    return { success: false };
  }
}

export async function getAccessTokenForClient(): Promise<string | null> {
  const accessToken = await getAccessToken();
  return accessToken ?? null;
}

export async function getVerificationTokenForClient(): Promise<string | null> {
  const verificationToken = await getVerificationToken();
  return verificationToken ?? null;
}

export async function verifyPassword(password: string, page?: string) {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      return { success: false, error: "인증 토큰을 가져올 수 없습니다." };
    }

    const existingVerificationToken = await getVerificationToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };

    if (existingVerificationToken) {
      headers["X-Verification-Token"] = `Bearer ${existingVerificationToken}`;
    }

    const body: { password: string; page?: string } = { password };
    if (page) {
      body.page = page;
    }

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.verifyPassword}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.error ?? errorData.message ?? "비밀번호가 일치하지 않습니다." };
    }

    const data: { verificationToken: string; message: string } = await response.json();
    await setVerificationToken(data.verificationToken);
    await setPasswordVerified();

    return { success: true, data: { verificationToken: data.verificationToken } };
  } catch {
    return { success: false, error: "인증 중 오류가 발생했습니다." };
  }
}

export async function checkVerification(page: string) {
  try {
    const verificationToken = await getVerificationToken();
    if (!verificationToken) {
      return { success: false, error: "2차 인증이 필요합니다." };
    }

    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.auth.checkVerification}?page=${encodeURIComponent(page)}`,
      {
        method: "GET",
        headers: {
          "X-Verification-Token": `Bearer ${verificationToken}`,
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      if (response.status === 401) {
        return { success: false, error: "2차 인증이 필요합니다." };
      }
      return { success: false, error: "인증 확인 중 오류가 발생했습니다." };
    }

    return { success: true };
  } catch {
    return { success: false, error: "인증 확인 중 오류가 발생했습니다." };
  }
}
