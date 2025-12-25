import { SettlementMonthlyParams, SettlementMonthlyResponse } from "@/types/settlements-monthly";

const buildSearchParams = (params: SettlementMonthlyParams): URLSearchParams => {
  const searchParams = new URLSearchParams();
  searchParams.append("year", params.year.toString());
  searchParams.append("month", params.month.toString());

  if (params.period) {
    searchParams.append("period", params.period);
  }
  if (params.type) {
    searchParams.append("type", params.type);
  }
  if (params.date) {
    searchParams.append("date", params.date);
  }
  if (params.nickname) {
    searchParams.append("nickname", params.nickname);
  }
  if (params.status) {
    searchParams.append("status", params.status);
  }
  if (params.page) {
    searchParams.append("page", params.page.toString());
  }
  if (params.pageSize) {
    searchParams.append("pageSize", params.pageSize.toString());
  }

  return searchParams;
};

export async function getSettlementsMonthly(params: SettlementMonthlyParams): Promise<SettlementMonthlyResponse> {
  const searchParams = buildSearchParams(params);
  const response = await fetch(`/api/dashboard/settlements-monthly?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch settlements monthly");
  }

  return response.json();
}
