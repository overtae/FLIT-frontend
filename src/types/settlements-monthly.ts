import { Settlement } from "./dashboard";

export type SettlementPeriod = "1week" | "2week" | "month";

export type SettlementType = "shop" | "florist";

export type SettlementStatus = "pending" | "completed" | "cancelled";

export type SettlementItem = Settlement;

export type SettlementDateData = {
  date: string;
  items: SettlementItem[];
};

export type SettlementMonthlyParams = {
  year: number;
  month: number;
  period?: SettlementPeriod;
  type?: SettlementType;
  date?: string;
  nickname?: string;
  status?: SettlementStatus;
  page?: number;
  pageSize?: number;
};

export type SettlementMonthlyResponse = {
  data: SettlementDateData[];
  total: number;
  page: number;
  pageSize: number;
};
