export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
export const CLIENT_BASE_URL = process.env.NEXT_PUBLIC_CLIENT_BASE_URL ?? "";
export const USE_MOCK_DATA = !process.env.NEXT_PUBLIC_API_BASE_URL;

export const API_ENDPOINTS = {
  auth: {
    signin: "/api/auth/signin",
    signout: "/api/auth/signout",
    refresh: "/api/auth/refresh",
    me: "/api/auth/me",
    verifyPassword: "/api/auth/verify-password",
    checkVerification: "/api/auth/check-verification",
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
  verificationToken: {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 15,
  },
  pageVerification: {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 60,
  },
} as const;

export const SOCIAL_LOGIN = {
  naver: {
    clientId: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID ?? "",
    clientSecret: process.env.NAVER_CLIENT_SECRET ?? "",
    redirectUri: `${CLIENT_BASE_URL}/auth/callback/naver`,
  },
  kakao: {
    clientId: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID ?? "",
    redirectUri: `${CLIENT_BASE_URL}/auth/callback/kakao`,
  },
  google: {
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    redirectUri: `${CLIENT_BASE_URL}/auth/callback/google`,
  },
};
