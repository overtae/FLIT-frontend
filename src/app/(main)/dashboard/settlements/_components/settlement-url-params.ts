import { format } from "date-fns";

import type { SettlementPeriod, SettlementStatus } from "@/types/settlement.type";

export interface SettlementURLUpdates {
  period?: SettlementPeriod;
  types?: Array<"SHOP" | "FLORIST">;
  date?: Date | null;
  nickname?: string;
  statuses?: SettlementStatus[];
  year?: number;
  month?: number;
  page?: number;
  pageSize?: number;
}

export interface SettlementURLState {
  currentYear: number;
  currentMonth: number;
  selectedPeriod: SettlementPeriod;
  selectedTypes: Array<"SHOP" | "FLORIST">;
  selectedDate: Date | null;
  search: string;
  selectedStatuses: SettlementStatus[];
  pageIndex: number;
  pageSize: number;
}

const setOptionalParam = (params: URLSearchParams, key: string, value: string | null | undefined) => {
  if (value) {
    params.set(key, value);
  }
};

const setTypesParam = (params: URLSearchParams, types: Array<"SHOP" | "FLORIST">) => {
  if (types.length > 0 && types.length < 2) {
    params.set("types", types.join(","));
  }
};

const setStatusesParam = (params: URLSearchParams, statuses: SettlementStatus[]) => {
  if (statuses.length > 0) {
    params.set("statuses", statuses.join(","));
  }
};

const setBasicParams = (
  params: URLSearchParams,
  year: number,
  month: number,
  period: SettlementPeriod | undefined,
  page: number,
  pageSize: number,
) => {
  params.set("year", year.toString());
  params.set("month", month.toString());
  if (period) {
    params.set("period", period.toString());
  } else {
    params.delete("period");
  }
  params.set("page", (page + 1).toString());
  params.set("pageSize", pageSize.toString());
};

export const resolveSettlementParams = (updates: SettlementURLUpdates, state: SettlementURLState) => {
  return {
    year: updates.year ?? state.currentYear,
    month: updates.month ?? state.currentMonth,
    period: updates.period ?? state.selectedPeriod,
    page: updates.page ?? state.pageIndex,
    pageSize: updates.pageSize ?? state.pageSize,
    types: updates.types ?? state.selectedTypes,
    date: updates.date ?? state.selectedDate,
    nickname: updates.nickname ?? state.search,
    statuses: updates.statuses ?? state.selectedStatuses,
  };
};

export const buildSettlementSearchParams = (updates: SettlementURLUpdates, state: SettlementURLState) => {
  const params = new URLSearchParams();
  const resolved = resolveSettlementParams(updates, state);

  setBasicParams(params, resolved.year, resolved.month, resolved.period, resolved.page, resolved.pageSize);
  setTypesParam(params, resolved.types);
  setOptionalParam(params, "date", resolved.date ? format(resolved.date, "yyyy-MM-dd") : null);
  setOptionalParam(params, "nickname", resolved.nickname);
  setStatusesParam(params, resolved.statuses);

  return params;
};
