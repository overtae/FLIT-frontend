import { PaginatedResponse, User } from "@/types/dashboard";

export async function getUsers(params?: {
  category?: string;
  page?: number;
  pageSize?: number;
  search?: string;
  grades?: string;
  date?: string;
}): Promise<PaginatedResponse<User>> {
  const searchParams = new URLSearchParams();
  if (params?.category) {
    searchParams.append("category", params.category);
  }
  if (params?.page) {
    searchParams.append("page", params.page.toString());
  }
  if (params?.pageSize) {
    searchParams.append("pageSize", params.pageSize.toString());
  }
  if (params?.search) {
    searchParams.append("search", params.search);
  }
  if (params?.grades) {
    searchParams.append("grades", params.grades);
  }
  if (params?.date) {
    searchParams.append("date", params.date);
  }

  const response = await fetch(`/api/dashboard/users?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
}

export interface UserOverviewData {
  totalUserData: Array<{ date: string; count: number }>;
  genderData: Array<{ name: string; value: number }>;
  ageData: Array<{ name: string; value: number }>;
  quickStats: {
    customer: { total: number; change: number; label: string };
    store: { total: number; change: number; label: string };
    florist: { total: number; change: number; label: string };
    out: { total: number; change: number; label: string };
  };
}

export async function getUserOverview(params?: {
  category?: string;
  period?: string;
  customerType?: string;
}): Promise<UserOverviewData> {
  const searchParams = new URLSearchParams();
  if (params?.category) {
    searchParams.append("category", params.category);
  }
  if (params?.period) {
    searchParams.append("period", params.period);
  }
  if (params?.customerType) {
    searchParams.append("customerType", params.customerType);
  }

  const response = await fetch(`/api/dashboard/users/overview?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch user overview");
  }

  return response.json();
}

export interface ProfileData {
  name: string;
  nickname: string;
  phone: string;
  level: string;
  code: string;
  address: string;
  detailAddress: string;
  sns: string;
  profileImage?: string;
}

export interface UpdateProfileRequest {
  name?: string;
  nickname?: string;
  phone?: string;
  level?: string;
  address?: string;
  detailAddress?: string;
  sns?: string;
  profileImage?: File;
}

export async function getCurrentUserProfile(): Promise<ProfileData> {
  const response = await fetch("/api/dashboard/users/me");
  if (!response.ok) {
    throw new Error("Failed to fetch profile");
  }

  return response.json();
}

export async function updateUserProfile(data: UpdateProfileRequest): Promise<{
  success: boolean;
  message: string;
  data: ProfileData;
}> {
  const hasFile = data.profileImage instanceof File;

  let body: FormData | string;
  const headers: HeadersInit = {};

  if (hasFile) {
    const formData = new FormData();
    if (data.name) formData.append("name", data.name);
    if (data.nickname) formData.append("nickname", data.nickname);
    if (data.phone) formData.append("phone", data.phone);
    if (data.level) formData.append("level", data.level);
    if (data.address) formData.append("address", data.address);
    if (data.detailAddress) formData.append("detailAddress", data.detailAddress);
    if (data.sns) formData.append("sns", data.sns);
    if (data.profileImage) formData.append("profileImage", data.profileImage);
    body = formData;
  } else {
    body = JSON.stringify({
      name: data.name,
      nickname: data.nickname,
      phone: data.phone,
      level: data.level,
      address: data.address,
      detailAddress: data.detailAddress,
      sns: data.sns,
    });
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch("/api/dashboard/users/me", {
    method: "PATCH",
    headers,
    body,
  });

  if (!response.ok) {
    throw new Error("Failed to update profile");
  }

  return response.json();
}
