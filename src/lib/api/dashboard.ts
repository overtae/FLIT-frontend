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
