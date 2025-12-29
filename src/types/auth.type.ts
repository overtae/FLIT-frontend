export interface LoginRequest {
  loginId: string;
  password: string;
}

export interface UserInfo {
  userId: number;
  profileImageUrl: string;
  name: string;
  nickname: string;
  phoneNumber: string;
  sns: string;
  level: string;
  code: string;
  address: string;
  detailAddress: string;
}

export interface UpdateUserInfoRequest {
  profileImage?: File;
  name?: string;
  nickname?: string;
  phoneNumber?: string;
  sns?: string;
  level?: string;
  code?: string;
  address?: string;
  detailAddress?: string;
}

export interface PasswordVerificationRequest {
  password: string;
  page?: string;
}

export interface Notification {
  notificationId: number;
  title: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

export interface MarkNotificationReadRequest {
  isRead: boolean;
}

export interface MarkNotificationsReadRequest {
  notificationIds: number[];
}

export interface LoginResponse {
  user: {
    userId: number;
    nickname: string;
    level: string;
  };
}

export interface UserMeResponse {
  userId: number;
  nickname: string;
  level: string;
}

export interface UserProfileResponse {
  userId: number;
  profileImageUrl: string;
  name: string;
  nickname: string;
  phoneNumber: string;
  sns: string;
  level: string;
  code: string;
  address: string;
  detailAddress: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}
