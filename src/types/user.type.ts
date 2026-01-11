export type UserType = "CUSTOMER_INDIVIDUAL" | "CUSTOMER_OWNER" | "SHOP" | "FLORIST";
export type UserGrade =
  | "GREEN"
  | "YELLOW"
  | "ORANGE"
  | "RED"
  | "SILVER"
  | "GOLD"
  | "FREE"
  | "FLINNEY"
  | "FLITER"
  | "PREMIUM"
  | "VIP";
export type Period = "WEEK" | "MONTH" | "YEAR";

export interface UserStatisticsTotalParams {
  targetDate?: string;
  period?: Period;
  type?: "ALL" | UserType;
}

export interface UserStatisticsTotalResponse {
  current: Array<{ date: string; value: number }>;
  last: Array<{ date: string; value: number }>;
}

export interface UserStatisticsOverviewParams {
  type?: "ALL" | UserType;
}

export interface UserStatisticsOverviewResponse {
  stats: Array<{ total: number; changed: number }>;
  gender: { male: number; female: number; etc: number };
  age: Array<{ label: string; value: number }>;
}

export interface UserListParams {
  page?: number;
  size?: number;
  name?: string;
  joinDate?: string;
  grade?: "ALL" | "GREEN" | "YELLOW" | "ORANGE" | "RED" | "SILVER" | "GOLD";
}

export interface User {
  userId: number;
  grade: string;
  profileImageUrl: string;
  name: string;
  nickname: string;
  loginId: string;
  mail: string;
  address: string;
  phoneNumber: string;
  lastLoginDate: string;
  joinDate: string;
  secedeDate?: string;
}

export interface UserDetail {
  userId: number;
  type: UserType;
  grade: string;
  profileImageUrl: string;
  name: string;
  nickname: string;
  loginId: string;
  mail: string;
  address: string;
  detailAddress: string;
  phoneNumber: string;
  businessNumber?: string;
  businessLicenseUrl?: string;
  lastLoginDate: string;
  lastPurchaseDate?: string;
  joinDate: string;
  secedeDate?: string;
}

export interface UpdateUserGradeRequest {
  grade: string;
}

export interface UserSettlementParams {
  year?: string;
  month?: string;
}

export interface UserSettlement {
  settlementId: number;
  settlementDate: string;
}

export interface SecederListParams {
  page?: number;
  size?: number;
  type?: "ALL" | "CUSTOMER" | "SHOP" | "FLORIST";
  name?: string;
  secedeDate?: string;
}
