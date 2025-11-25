export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://workspace.taeyoung2da.com";

export const API_ENDPOINTS = {
  auth: {
    signin: "/api/auth/signin",
    signout: "/api/auth/signout",
    refresh: "/api/auth/refresh",
    me: "/api/auth/me",
    verifyPassword: "/api/auth/verify-password",
  },
} as const;

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
} as const;

export const TOKEN_COOKIE_OPTIONS = {
  accessToken: {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 60 * 24 * 7,
  },
  refreshToken: {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 60 * 24 * 30,
  },
} as const;
