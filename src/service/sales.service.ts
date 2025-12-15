import { PaginatedResponse, RevenueDetail, SalesDetail } from "@/types/dashboard";

export async function getSalesDetails(params?: {
  page?: number;
  pageSize?: number;
}): Promise<PaginatedResponse<SalesDetail>> {
  const searchParams = new URLSearchParams();
  if (params?.page) {
    searchParams.append("page", params.page.toString());
  }
  if (params?.pageSize) {
    searchParams.append("pageSize", params.pageSize.toString());
  }

  const response = await fetch(`/api/dashboard/sales/details?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch sales details");
  }

  return response.json();
}

export async function getRevenueDetails(params?: {
  page?: number;
  pageSize?: number;
}): Promise<PaginatedResponse<RevenueDetail>> {
  const searchParams = new URLSearchParams();
  if (params?.page) {
    searchParams.append("page", params.page.toString());
  }
  if (params?.pageSize) {
    searchParams.append("pageSize", params.pageSize.toString());
  }

  const response = await fetch(`/api/dashboard/sales/revenue?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch revenue details");
  }

  return response.json();
}
