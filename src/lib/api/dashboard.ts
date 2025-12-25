import {
  DashboardSection,
  RevenueDetail,
  SalesDetail,
  ScheduleEvent,
  Settlement,
  SettlementDetail,
  SettlementDetailTransaction,
  Transaction,
  User,
} from "@/types/dashboard";

export async function getUsers(category?: string): Promise<User[]> {
  const params = new URLSearchParams();
  if (category) {
    params.append("category", category);
  }

  const response = await fetch(`/api/dashboard/users?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
}

export async function getTransactions(params?: {
  type?: string;
  paymentMethod?: string;
  refundStatus?: string;
  subCategory?: string;
}): Promise<Transaction[]> {
  const searchParams = new URLSearchParams();
  if (params?.type) {
    searchParams.append("type", params.type);
  }
  if (params?.paymentMethod) {
    searchParams.append("paymentMethod", params.paymentMethod);
  }
  if (params?.refundStatus) {
    searchParams.append("refundStatus", params.refundStatus);
  }
  if (params?.subCategory) {
    searchParams.append("subCategory", params.subCategory);
  }

  const response = await fetch(`/api/dashboard/transactions?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch transactions");
  }

  return response.json();
}

export async function getScheduleEvents(): Promise<ScheduleEvent[]> {
  const response = await fetch("/api/dashboard/schedules");
  if (!response.ok) {
    throw new Error("Failed to fetch schedule events");
  }

  const events = await response.json();
  return events.map((event: ScheduleEvent & { date: string }) => ({
    ...event,
    date: new Date(event.date),
  }));
}

export async function getSettlements(params?: {
  status?: string;
  type?: string;
  settlementDate?: string;
}): Promise<Settlement[]> {
  const searchParams = new URLSearchParams();
  if (params?.status) {
    searchParams.append("status", params.status);
  }
  if (params?.type) {
    searchParams.append("type", params.type);
  }
  if (params?.settlementDate) {
    searchParams.append("settlementDate", params.settlementDate);
  }

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

export async function getDashboardSections(): Promise<DashboardSection[]> {
  const response = await fetch("/api/dashboard/sections");
  if (!response.ok) {
    throw new Error("Failed to fetch dashboard sections");
  }

  return response.json();
}

export async function getSalesDetails(): Promise<SalesDetail[]> {
  const response = await fetch("/api/dashboard/sales/details");
  if (!response.ok) {
    throw new Error("Failed to fetch sales details");
  }

  return response.json();
}

export async function getRevenueDetails(): Promise<RevenueDetail[]> {
  const response = await fetch("/api/dashboard/sales/revenue");
  if (!response.ok) {
    throw new Error("Failed to fetch revenue details");
  }

  return response.json();
}

export interface RevenueDashboardData {
  totalRevenue: number;
  paymentAmount: number;
  paymentCount: number;
  deliveryInProgress: number;
  refundCancelAmount: number;
  refundCancelCount: number;
  deliveryCompleted: number;
  paymentCountBreakdown: {
    card: number;
    transfer: number;
    pos: number;
  };
  paymentAmountBreakdown: {
    card: number;
    transfer: number;
    pos: number;
  };
  refundCancelCountBreakdown: {
    card: number;
    transfer: number;
    pos: number;
  };
  refundCancelAmountBreakdown: {
    card: number;
    transfer: number;
    pos: number;
  };
}

export async function getRevenueDashboardData(date?: Date): Promise<RevenueDashboardData> {
  const params = new URLSearchParams();
  if (date) {
    params.append("date", date.toISOString());
  }

  const response = await fetch(`/api/dashboard/sales/revenue/dashboard?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch revenue dashboard data");
  }

  return response.json();
}

export interface YearlyRevenueDetailData {
  totalAmount: number;
  paymentAmount: number;
  paymentCount: number;
  deliveryInProgress: number;
  refundCancelAmount: number;
  refundCancelCount: number;
  deliveryCompleted: number;
}

export async function getYearlyRevenueDetailData(year: string): Promise<YearlyRevenueDetailData> {
  const params = new URLSearchParams();
  params.append("year", year);

  const response = await fetch(`/api/dashboard/sales/revenue/yearly-detail?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch yearly revenue detail data");
  }

  return response.json();
}

export interface QuarterProductDetailData {
  totalAmount: number;
  paymentAmount: number;
  paymentCount: number;
  refundCancelAmount: number;
  refundCancelCount: number;
  deliveryInProgress: number;
  deliveryCompleted: number;
  paymentBreakdown: {
    card: number;
    transfer: number;
    pos: number;
  };
}

export async function getQuarterProductDetailData(year: string, quarter?: string): Promise<QuarterProductDetailData> {
  const params = new URLSearchParams();
  params.append("year", year);
  if (quarter) {
    params.append("quarter", quarter);
  }

  const response = await fetch(`/api/dashboard/sales/products/quarter-detail?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch quarter product detail data");
  }

  return response.json();
}

export interface YearlyRevenueChartData {
  quarterlyData: Array<{ quarter: string; amount: number }>;
  yearlyComparisonData: Array<{ month: string; [key: string]: number | string }>;
}

export async function getYearlyRevenueChartData(year?: string, yearRange?: string): Promise<YearlyRevenueChartData> {
  const params = new URLSearchParams();
  if (year) {
    params.append("year", year);
  }
  if (yearRange) {
    params.append("yearRange", yearRange);
  }

  const response = await fetch(`/api/dashboard/sales/revenue/yearly-chart?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch yearly revenue chart data");
  }

  return response.json();
}

export interface YearlySalesChartData {
  quarterlyData: Array<{ quarter: string; card: number; pos: number; transfer: number }>;
  yearlyComparisonData: Array<{ month: string; [key: string]: number | string }>;
}

export async function getYearlySalesChartData(year?: string, yearRange?: string): Promise<YearlySalesChartData> {
  const params = new URLSearchParams();
  if (year) {
    params.append("year", year);
  }
  if (yearRange) {
    params.append("yearRange", yearRange);
  }

  const response = await fetch(`/api/dashboard/sales/products/yearly-chart?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch yearly sales chart data");
  }

  return response.json();
}

// Revenue chart data
export async function getWeeklyRevenueChartData(params?: {
  paymentMethod?: "total" | "card" | "pos" | "transfer";
}): Promise<Array<{ day: string; thisWeek: number; lastWeek: number }>> {
  const searchParams = new URLSearchParams();
  if (params?.paymentMethod) {
    searchParams.append("paymentMethod", params.paymentMethod);
  }
  const response = await fetch(`/api/dashboard/sales/revenue/weekly-chart?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch weekly revenue chart data");
  }
  return response.json();
}

export async function getDailyRevenueChartData(params?: {
  paymentMethod?: "total" | "card" | "pos" | "transfer";
}): Promise<Array<{ time: string; thisDay: number; lastDay: number }>> {
  const searchParams = new URLSearchParams();
  if (params?.paymentMethod) {
    searchParams.append("paymentMethod", params.paymentMethod);
  }
  const response = await fetch(`/api/dashboard/sales/revenue/daily-chart?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch daily revenue chart data");
  }
  return response.json();
}

export async function getMonthlyRevenueChartData(params?: {
  paymentMethod?: "total" | "card" | "pos" | "transfer";
}): Promise<Array<{ date: string; thisMonth: number; lastMonth: number }>> {
  const searchParams = new URLSearchParams();
  if (params?.paymentMethod) {
    searchParams.append("paymentMethod", params.paymentMethod);
  }
  const response = await fetch(`/api/dashboard/sales/revenue/monthly-chart?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch monthly revenue chart data");
  }
  return response.json();
}

// Products chart data
export async function getWeeklySalesChartData(params?: {
  paymentMethod?: "total" | "card" | "pos" | "transfer";
  category?: string;
}): Promise<Array<{ day: string; thisWeek: number; lastWeek: number }>> {
  const searchParams = new URLSearchParams();
  if (params?.paymentMethod) {
    searchParams.append("paymentMethod", params.paymentMethod);
  }
  if (params?.category) {
    searchParams.append("category", params.category);
  }
  const response = await fetch(`/api/dashboard/sales/products/weekly-chart?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch weekly sales chart data");
  }
  return response.json();
}

export async function getDailySalesChartData(params?: {
  paymentMethod?: "total" | "card" | "pos" | "transfer";
  category?: string;
}): Promise<Array<{ date: string; thisWeek: number; lastWeek: number }>> {
  const searchParams = new URLSearchParams();
  if (params?.paymentMethod) {
    searchParams.append("paymentMethod", params.paymentMethod);
  }
  if (params?.category) {
    searchParams.append("category", params.category);
  }
  const response = await fetch(`/api/dashboard/sales/products/daily-chart?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch daily sales chart data");
  }
  return response.json();
}

export async function getMonthlySalesChartData(params?: {
  paymentMethod?: "total" | "card" | "pos" | "transfer";
  category?: string;
}): Promise<Array<{ month: string; thisMonth: number; lastMonth: number }>> {
  const searchParams = new URLSearchParams();
  if (params?.paymentMethod) {
    searchParams.append("paymentMethod", params.paymentMethod);
  }
  if (params?.category) {
    searchParams.append("category", params.category);
  }
  const response = await fetch(`/api/dashboard/sales/products/monthly-chart?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch monthly sales chart data");
  }
  return response.json();
}

// Orders chart data
export async function getSearchTrendData(params?: {
  period?: "weekly" | "monthly" | "yearly";
}): Promise<Array<{ rank: number; keyword: string; search: number; bounceRate: number }>> {
  const searchParams = new URLSearchParams();
  if (params?.period) {
    searchParams.append("period", params.period);
  }
  const response = await fetch(`/api/dashboard/sales/orders/search-trend?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch search trend data");
  }
  return response.json();
}

// Customer dashboard data
export async function getCustomerDashboardData(): Promise<{
  genderData: Array<{ name: string; value: number }>;
  ageData: Array<{ age: string; value: number }>;
  rankingData: Array<{ rank: number; name: string; amount: number }>;
}> {
  const response = await fetch("/api/dashboard/sales/customers/dashboard");
  if (!response.ok) {
    throw new Error("Failed to fetch customer dashboard data");
  }
  return response.json();
}

// Order dashboard data
export async function getOrderDashboardData(): Promise<{
  cvrData: Array<{ period: string; cvr: number }>;
  searchTrendData: Array<{ keyword: string; search: number; bounceRate: number }>;
}> {
  const response = await fetch("/api/dashboard/sales/orders/dashboard");
  if (!response.ok) {
    throw new Error("Failed to fetch order dashboard data");
  }
  return response.json();
}

// Default visitors chart data
export async function getVisitorsChartData(params?: {
  timeRange?: "7d" | "30d" | "90d";
}): Promise<Array<{ date: string; desktop: number; mobile: number }>> {
  const searchParams = new URLSearchParams();
  if (params?.timeRange) {
    searchParams.append("timeRange", params.timeRange);
  }
  const response = await fetch(`/api/dashboard/default/visitors-chart?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch visitors chart data");
  }
  return response.json();
}
