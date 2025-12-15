import { PaginatedResponse, Settlement, SettlementDetail, SettlementDetailTransaction } from "@/types/dashboard";

const appendIfExists = (searchParams: URLSearchParams, key: string, value: string | number | undefined) => {
  if (value !== undefined) {
    searchParams.append(key, value.toString());
  }
};

const buildSearchParams = (params?: {
  status?: string;
  type?: string;
  settlementDate?: string;
  page?: number;
  pageSize?: number;
}): URLSearchParams => {
  const searchParams = new URLSearchParams();
  if (!params) return searchParams;

  appendIfExists(searchParams, "status", params.status);
  appendIfExists(searchParams, "type", params.type);
  appendIfExists(searchParams, "settlementDate", params.settlementDate);
  appendIfExists(searchParams, "page", params.page);
  appendIfExists(searchParams, "pageSize", params.pageSize);

  return searchParams;
};

export async function getSettlements(params?: {
  status?: string;
  type?: string;
  settlementDate?: string;
  page?: number;
  pageSize?: number;
}): Promise<PaginatedResponse<Settlement>> {
  const searchParams = buildSearchParams(params);
  const response = await fetch(`/api/dashboard/settlements?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch settlements");
  }

  return response.json();
}

export async function getSettlementDetail(id: string): Promise<{
  detail: SettlementDetail;
  transactions: SettlementDetailTransaction[];
}> {
  const response = await fetch(`/api/dashboard/settlements/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch settlement detail");
  }

  const data = await response.json();
  return {
    detail: {
      ...data.detail,
      settlementDate: new Date(data.detail.settlementDate),
      lastUpdated: new Date(data.detail.lastUpdated),
    },
    transactions: data.transactions,
  };
}
