import { PaginatedResponse, User } from "@/types/dashboard";

export async function getUsers(params?: {
  category?: string;
  page?: number;
  pageSize?: number;
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

  const response = await fetch(`/api/dashboard/users?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
}
