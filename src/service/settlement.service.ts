import { fetchWithAuth } from "@/lib/api/client-fetch";
import type {
  SettlementListParams,
  Settlement,
  SettlementDetailParams,
  SettlementDetail,
} from "@/types/settlement.type";

export async function getSettlements(params?: SettlementListParams): Promise<Settlement[]> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.size) searchParams.append("size", params.size.toString());
  if (params?.period) searchParams.append("period", params.period);
  if (params?.type) searchParams.append("type", params.type);
  if (params?.year) searchParams.append("year", params.year);
  if (params?.month) searchParams.append("month", params.month);

  const queryString = searchParams.toString();
  const endpoint = queryString ? `/api/v1/settlement?${queryString}` : "/api/v1/settlement";

  const response = await fetchWithAuth(endpoint);
  if (!response.ok) {
    throw new Error("Failed to fetch settlements");
  }

  return response.json();
}

export async function getSettlementDetail(
  settlementId: number,
  params?: SettlementDetailParams,
): Promise<SettlementDetail> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.size) searchParams.append("size", params.size.toString());
  if (params?.paymentDate) searchParams.append("paymentDate", params.paymentDate);
  if (params?.paymentMethod) searchParams.append("paymentMethod", params.paymentMethod);

  const queryString = searchParams.toString();
  const endpoint = queryString
    ? `/api/v1/settlement/${settlementId}?${queryString}`
    : `/api/v1/settlement/${settlementId}`;

  const response = await fetchWithAuth(endpoint);
  if (!response.ok) {
    throw new Error("Failed to fetch settlement detail");
  }

  return response.json();
}
