export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string>;
}
