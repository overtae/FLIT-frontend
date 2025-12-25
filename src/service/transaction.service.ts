import { PaginatedResponse, Transaction } from "@/types/dashboard";

const appendIfExists = (searchParams: URLSearchParams, key: string, value: string | number | undefined) => {
  if (value !== undefined && value !== null) {
    searchParams.append(key, value.toString());
  }
};

const buildSearchParams = (params?: {
  type?: string;
  paymentMethod?: string;
  refundStatus?: string;
  subCategory?: string;
  page?: number;
  pageSize?: number;
  search?: string;
  types?: string;
  paymentMethods?: string;
  refundStatuses?: string;
  date?: string;
}): URLSearchParams => {
  const searchParams = new URLSearchParams();
  if (!params) return searchParams;

  appendIfExists(searchParams, "type", params.type);
  appendIfExists(searchParams, "paymentMethod", params.paymentMethod);
  appendIfExists(searchParams, "refundStatus", params.refundStatus);
  appendIfExists(searchParams, "subCategory", params.subCategory);
  appendIfExists(searchParams, "page", params.page);
  appendIfExists(searchParams, "pageSize", params.pageSize);
  appendIfExists(searchParams, "search", params.search);
  appendIfExists(searchParams, "types", params.types);
  appendIfExists(searchParams, "paymentMethods", params.paymentMethods);
  appendIfExists(searchParams, "refundStatuses", params.refundStatuses);
  appendIfExists(searchParams, "date", params.date);

  return searchParams;
};

export async function getTransactions(params?: {
  type?: string;
  paymentMethod?: string;
  refundStatus?: string;
  subCategory?: string;
  page?: number;
  pageSize?: number;
  search?: string;
  types?: string;
  paymentMethods?: string;
  refundStatuses?: string;
  date?: string;
}): Promise<PaginatedResponse<Transaction>> {
  const searchParams = buildSearchParams(params);
  const response = await fetch(`/api/dashboard/transactions?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch transactions");
  }

  return response.json();
}
