import { PaginatedResponse, RevenueDetail, SalesDetail } from "@/types/dashboard";

export async function getSalesDetails(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  categories?: string;
  paymentMethods?: string;
  regions?: string;
  orderStatuses?: string;
  today?: boolean;
  dateFrom?: string;
  dateTo?: string;
}): Promise<PaginatedResponse<SalesDetail>> {
  const searchParams = new URLSearchParams();
  if (params?.page) {
    searchParams.append("page", params.page.toString());
  }
  if (params?.pageSize) {
    searchParams.append("pageSize", params.pageSize.toString());
  }
  if (params?.search) {
    searchParams.append("search", params.search);
  }
  if (params?.categories) {
    searchParams.append("categories", params.categories);
  }
  if (params?.paymentMethods) {
    searchParams.append("paymentMethods", params.paymentMethods);
  }
  if (params?.regions) {
    searchParams.append("regions", params.regions);
  }
  if (params?.orderStatuses) {
    searchParams.append("orderStatuses", params.orderStatuses);
  }
  if (params?.today) {
    searchParams.append("today", "true");
  }
  if (params?.dateFrom) {
    searchParams.append("dateFrom", params.dateFrom);
  }
  if (params?.dateTo) {
    searchParams.append("dateTo", params.dateTo);
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
  search?: string;
  categories?: string;
  paymentMethods?: string;
  regions?: string;
  orderStatuses?: string;
  today?: boolean;
  dateFrom?: string;
  dateTo?: string;
}): Promise<PaginatedResponse<RevenueDetail>> {
  const searchParams = new URLSearchParams();
  if (params?.page) {
    searchParams.append("page", params.page.toString());
  }
  if (params?.pageSize) {
    searchParams.append("pageSize", params.pageSize.toString());
  }
  if (params?.search) {
    searchParams.append("search", params.search);
  }
  if (params?.categories) {
    searchParams.append("categories", params.categories);
  }
  if (params?.paymentMethods) {
    searchParams.append("paymentMethods", params.paymentMethods);
  }
  if (params?.regions) {
    searchParams.append("regions", params.regions);
  }
  if (params?.orderStatuses) {
    searchParams.append("orderStatuses", params.orderStatuses);
  }
  if (params?.today) {
    searchParams.append("today", "true");
  }
  if (params?.dateFrom) {
    searchParams.append("dateFrom", params.dateFrom);
  }
  if (params?.dateTo) {
    searchParams.append("dateTo", params.dateTo);
  }

  const response = await fetch(`/api/dashboard/sales/revenue?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch revenue details");
  }

  return response.json();
}
