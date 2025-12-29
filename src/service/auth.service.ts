import { fetchWithAuth } from "@/lib/api/client-fetch";
import type {
  LoginRequest,
  UserInfo,
  UpdateUserInfoRequest,
  PasswordVerificationRequest,
  UserMeResponse,
  UserProfileResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from "@/types/auth.type";

export async function login(credentials: LoginRequest): Promise<void> {
  const response = await fetchWithAuth("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error("Failed to login");
  }

  await response.json();
}

export async function loginWithNaver(body: unknown): Promise<unknown> {
  const response = await fetchWithAuth("/api/v1/auth/login/naver", {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Failed to login with Naver");
  }

  return response.json();
}

export async function loginWithKakao(body: unknown): Promise<unknown> {
  const response = await fetchWithAuth("/api/v1/auth/login/kakao", {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Failed to login with Kakao");
  }

  return response.json();
}

export async function loginWithGoogle(body: unknown): Promise<unknown> {
  const response = await fetchWithAuth("/api/v1/auth/login/google", {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Failed to login with Google");
  }

  return response.json();
}

export async function getUserMe(): Promise<UserMeResponse> {
  const response = await fetchWithAuth("/api/v1/auth/me");

  if (!response.ok) {
    throw new Error("Failed to fetch user info");
  }

  return response.json();
}

export async function getUserProfile(): Promise<UserProfileResponse> {
  const response = await fetchWithAuth("/api/v1/auth/me/profile");

  if (!response.ok) {
    throw new Error("Failed to fetch user profile");
  }

  return response.json();
}

// @deprecated Use getUserProfile instead
export async function getUserInfo(): Promise<UserInfo> {
  return getUserProfile();
}

export async function updateUserProfile(data: UpdateUserInfoRequest): Promise<UserProfileResponse> {
  const formData = new FormData();
  if (data.profileImage) formData.append("profileImage", data.profileImage);
  if (data.name) formData.append("name", data.name);
  if (data.nickname) formData.append("nickname", data.nickname);
  if (data.phoneNumber) formData.append("phoneNumber", data.phoneNumber);
  if (data.sns) formData.append("sns", data.sns);
  if (data.level) formData.append("level", data.level);
  if (data.code) formData.append("code", data.code);
  if (data.address) formData.append("address", data.address);
  if (data.detailAddress) formData.append("detailAddress", data.detailAddress);

  const response = await fetchWithAuth("/api/v1/auth/me/profile", {
    method: "PATCH",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to update user profile");
  }

  return response.json();
}

// @deprecated Use updateUserProfile instead
export async function updateUserInfo(data: UpdateUserInfoRequest): Promise<UserInfo> {
  return updateUserProfile(data);
}

export async function deleteUser(): Promise<void> {
  const response = await fetchWithAuth("/api/v1/auth/me", {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete user");
  }
}

export async function refreshToken(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
  const response = await fetchWithAuth("/api/v1/auth/refresh", {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh token");
  }

  return response.json();
}

export async function logout(): Promise<void> {
  const response = await fetchWithAuth("/api/v1/auth/logout", {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to logout");
  }

  window.location.href = "/auth/login";
}

export async function verifyPassword(data: PasswordVerificationRequest): Promise<unknown> {
  const response = await fetchWithAuth("/api/v1/auth/password-verification", {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to verify password");
  }

  return response.json();
}
