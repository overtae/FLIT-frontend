import { fetchWithAuth } from "@/lib/api/client-fetch";
import type {
  UserStatisticsTotalParams,
  UserStatisticsTotalResponse,
  UserStatisticsOverviewParams,
  UserStatisticsOverviewResponse,
  UserListParams,
  User,
  UserDetail,
  UpdateUserGradeRequest,
  UserSettlementParams,
  UserSettlement,
  SecederListParams,
  SecederUser,
} from "@/types/user.type";

export async function getUserStatisticsTotal(params?: UserStatisticsTotalParams): Promise<UserStatisticsTotalResponse> {
  const searchParams = new URLSearchParams();
  if (params?.targetDate) searchParams.append("targetDate", params.targetDate);
  if (params?.period) searchParams.append("period", params.period);
  if (params?.type) searchParams.append("type", params.type);

  const queryString = searchParams.toString();
  const endpoint = queryString ? `/api/v1/user/statistics/total?${queryString}` : "/api/v1/user/statistics/total";

  const response = await fetchWithAuth(endpoint);
  if (!response.ok) {
    throw new Error("Failed to fetch user statistics total");
  }

  return response.json();
}

export async function getUserStatisticsOverview(
  params?: UserStatisticsOverviewParams,
): Promise<UserStatisticsOverviewResponse> {
  const searchParams = new URLSearchParams();
  if (params?.type) searchParams.append("type", params.type);

  const queryString = searchParams.toString();
  const endpoint = queryString ? `/api/v1/user/statistics/overview?${queryString}` : "/api/v1/user/statistics/overview";

  const response = await fetchWithAuth(endpoint);
  if (!response.ok) {
    throw new Error("Failed to fetch user statistics overview");
  }

  return response.json();
}

export async function getSecederStatisticsTotal(
  params?: UserStatisticsTotalParams,
): Promise<UserStatisticsTotalResponse> {
  const searchParams = new URLSearchParams();
  if (params?.targetDate) searchParams.append("targetDate", params.targetDate);
  if (params?.period) searchParams.append("period", params.period);
  if (params?.type) searchParams.append("type", params.type);

  const queryString = searchParams.toString();
  const endpoint = queryString
    ? `/api/v1/user/seceder/statistics/total?${queryString}`
    : "/api/v1/user/seceder/statistics/total";

  const response = await fetchWithAuth(endpoint);
  if (!response.ok) {
    throw new Error("Failed to fetch seceder statistics total");
  }

  return response.json();
}

export async function getSecederStatisticsOverview(): Promise<UserStatisticsOverviewResponse> {
  const response = await fetch("/api/v1/user/seceder/statistics/overview");
  if (!response.ok) {
    throw new Error("Failed to fetch seceder statistics overview");
  }

  return response.json();
}

export async function getUsers(params?: UserListParams): Promise<User[]> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.size) searchParams.append("size", params.size.toString());
  if (params?.name) searchParams.append("name", params.name);
  if (params?.joinDate) searchParams.append("joinDate", params.joinDate);
  if (params?.grade) searchParams.append("grade", params.grade);

  const queryString = searchParams.toString();
  const endpoint = queryString ? `/api/v1/user?${queryString}` : "/api/v1/user";

  const response = await fetchWithAuth(endpoint);
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
}

export async function getUser(userId: number): Promise<UserDetail> {
  const response = await fetchWithAuth(`/api/v1/user/${userId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  return response.json();
}

export async function updateUserGrade(userId: number, data: UpdateUserGradeRequest): Promise<unknown> {
  const response = await fetchWithAuth(`/api/v1/user/${userId}/grade`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update user grade");
  }

  return response.json();
}

export async function deleteUser(userId: number): Promise<void> {
  const response = await fetchWithAuth(`/api/v1/user/${userId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete user");
  }
}

export async function getUserSettlement(userId: number, params?: UserSettlementParams): Promise<UserSettlement[]> {
  const searchParams = new URLSearchParams();
  if (params?.year) searchParams.append("year", params.year);
  if (params?.month) searchParams.append("month", params.month);

  const queryString = searchParams.toString();
  const endpoint = queryString
    ? `/api/v1/user/${userId}/settlement?${queryString}`
    : `/api/v1/user/${userId}/settlement`;

  const response = await fetchWithAuth(endpoint);
  if (!response.ok) {
    throw new Error("Failed to fetch user settlement");
  }

  return response.json();
}

export async function getSecederUsers(params?: SecederListParams): Promise<SecederUser[]> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.size) searchParams.append("size", params.size.toString());
  if (params?.type) searchParams.append("type", params.type);
  if (params?.name) searchParams.append("name", params.name);
  if (params?.secedeDate) searchParams.append("secedeDate", params.secedeDate);

  const queryString = searchParams.toString();
  const endpoint = queryString ? `/api/v1/user/seceder?${queryString}` : "/api/v1/user/seceder";

  const response = await fetchWithAuth(endpoint);
  if (!response.ok) {
    throw new Error("Failed to fetch seceder users");
  }

  return response.json();
}
