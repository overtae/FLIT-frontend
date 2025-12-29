import { fetchWithAuth } from "@/lib/api/client-fetch";
import type {
  RevenueOverviewParams,
  RevenueOverviewResponse,
  RevenueNetParams,
  RevenueNetResponse,
  RevenueNetYearlyParams,
  RevenueNetYearlyResponse,
  RevenueNetQuarterParams,
  RevenueNetQuarterResponse,
  RevenueDetailParams,
  RevenueDetailItem,
  ProductCategoryParams,
  ProductCategoryResponse,
  ProductNetParams,
  ProductNetResponse,
  ProductNetYearlyParams,
  ProductNetYearlyResponse,
  ProductNetQuarterParams,
  ProductNetQuarterResponse,
  ProductNetQuarterDetailResponse,
  ProductDetailParams,
  ProductDetailItem,
  CustomerGenderParams,
  CustomerGenderResponse,
  CustomerAgeParams,
  CustomerAgeResponse,
  OrderConversionRateParams,
  OrderConversionRateResponse,
  OrderCvrParams,
  OrderCvrResponse,
  OrderKeywordTrendParams,
  OrderKeywordTrendResponse,
} from "@/types/sales.type";

export async function getRevenueOverview(params?: RevenueOverviewParams): Promise<RevenueOverviewResponse> {
  const searchParams = new URLSearchParams();
  if (params?.targetDate) searchParams.append("targetDate", params.targetDate);

  const queryString = searchParams.toString();
  const endpoint = queryString ? `/api/v1/sales/revenue/overview?${queryString}` : "/api/v1/sales/revenue/overview";

  const response = await fetchWithAuth(endpoint);
  if (!response.ok) {
    throw new Error("Failed to fetch revenue overview");
  }

  return response.json();
}

export async function getRevenueNet(params: RevenueNetParams): Promise<RevenueNetResponse> {
  const searchParams = new URLSearchParams();
  searchParams.append("period", params.period);
  if (params.paymentMethod) searchParams.append("paymentMethod", params.paymentMethod);
  searchParams.append("startDate", params.startDate);
  searchParams.append("endDate", params.endDate);

  const response = await fetchWithAuth(`/api/v1/sales/revenue/net?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch revenue net");
  }

  return response.json();
}

export async function getRevenueNetYearly(params: RevenueNetYearlyParams): Promise<RevenueNetYearlyResponse[]> {
  const searchParams = new URLSearchParams();
  searchParams.append("startYear", params.startYear);
  searchParams.append("endYear", params.endYear);

  const response = await fetchWithAuth(`/api/v1/sales/revenue/net/yearly?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch revenue net yearly");
  }

  return response.json();
}

export async function getRevenueNetQuarter(params: RevenueNetQuarterParams): Promise<RevenueNetQuarterResponse> {
  const searchParams = new URLSearchParams();
  searchParams.append("targetYear", params.targetYear);

  const response = await fetchWithAuth(`/api/v1/sales/revenue/net/quarter?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch revenue net quarter");
  }

  return response.json();
}

export async function getRevenueNetQuarterDetail(): Promise<RevenueOverviewResponse> {
  const response = await fetch("/api/v1/sales/revenue/net/quarter/detail");
  if (!response.ok) {
    throw new Error("Failed to fetch revenue net quarter detail");
  }

  return response.json();
}

export async function getRevenueDetail(params?: RevenueDetailParams): Promise<RevenueDetailItem[]> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.size) searchParams.append("size", params.size.toString());
  if (params?.startDate) searchParams.append("startDate", params.startDate);
  if (params?.endDate) searchParams.append("endDate", params.endDate);
  if (params?.category) searchParams.append("category", params.category);
  if (params?.paymentMethod) searchParams.append("paymentMethod", params.paymentMethod);
  if (params?.region) searchParams.append("region", params.region);
  if (params?.status) searchParams.append("status", params.status);

  const queryString = searchParams.toString();
  const endpoint = queryString ? `/api/v1/sales/revenue/detail?${queryString}` : "/api/v1/sales/revenue/detail";

  const response = await fetchWithAuth(endpoint);
  if (!response.ok) {
    throw new Error("Failed to fetch revenue detail");
  }

  return response.json();
}

export async function getProductCategory(params: ProductCategoryParams): Promise<ProductCategoryResponse[]> {
  const searchParams = new URLSearchParams();
  searchParams.append("targetDate", params.targetDate);
  searchParams.append("category", params.category);

  const response = await fetchWithAuth(`/api/v1/sales/product/category?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch product category");
  }

  return response.json();
}

export async function getProductNet(params: ProductNetParams): Promise<ProductNetResponse> {
  const searchParams = new URLSearchParams();
  searchParams.append("period", params.period);
  if (params.paymentMethod) searchParams.append("paymentMethod", params.paymentMethod);
  searchParams.append("startDate", params.startDate);
  searchParams.append("endDate", params.endDate);

  const response = await fetchWithAuth(`/api/v1/sales/product/net?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch product net");
  }

  return response.json();
}

export async function getProductNetYearly(params: ProductNetYearlyParams): Promise<ProductNetYearlyResponse[]> {
  const searchParams = new URLSearchParams();
  searchParams.append("startYear", params.startYear);
  searchParams.append("endYear", params.endYear);

  const response = await fetchWithAuth(`/api/v1/sales/product/net/yearly?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch product net yearly");
  }

  return response.json();
}

export async function getProductNetQuarter(params: ProductNetQuarterParams): Promise<ProductNetQuarterResponse[]> {
  const searchParams = new URLSearchParams();
  searchParams.append("targetYear", params.targetYear);

  const response = await fetchWithAuth(`/api/v1/sales/product/net/quarter?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch product net quarter");
  }

  return response.json();
}

export async function getProductNetQuarterDetail(): Promise<ProductNetQuarterDetailResponse[]> {
  const response = await fetch("/api/v1/sales/product/net/quarter/detail");
  if (!response.ok) {
    throw new Error("Failed to fetch product net quarter detail");
  }

  return response.json();
}

export async function getProductDetail(params?: ProductDetailParams): Promise<ProductDetailItem[]> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.size) searchParams.append("size", params.size.toString());
  if (params?.startDate) searchParams.append("startDate", params.startDate);
  if (params?.endDate) searchParams.append("endDate", params.endDate);
  if (params?.category) searchParams.append("category", params.category);
  if (params?.paymentMethod) searchParams.append("paymentMethod", params.paymentMethod);
  if (params?.region) searchParams.append("region", params.region);
  if (params?.status) searchParams.append("status", params.status);

  const queryString = searchParams.toString();
  const endpoint = queryString ? `/api/v1/sales/product/detail?${queryString}` : "/api/v1/sales/product/detail";

  const response = await fetchWithAuth(endpoint);
  if (!response.ok) {
    throw new Error("Failed to fetch product detail");
  }

  return response.json();
}

export async function getCustomerGender(params: CustomerGenderParams): Promise<CustomerGenderResponse> {
  const searchParams = new URLSearchParams();
  searchParams.append("targetDate", params.targetDate);

  const response = await fetchWithAuth(`/api/v1/sales/customer/gender?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch customer gender");
  }

  return response.json();
}

export async function getCustomerAge(params: CustomerAgeParams): Promise<CustomerAgeResponse> {
  const searchParams = new URLSearchParams();
  searchParams.append("targetDate", params.targetDate);

  const response = await fetchWithAuth(`/api/v1/sales/customer/age?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch customer age");
  }

  return response.json();
}

export async function getOrderConversionRate(params: OrderConversionRateParams): Promise<OrderConversionRateResponse> {
  const searchParams = new URLSearchParams();
  searchParams.append("period", params.period);

  const response = await fetchWithAuth(`/api/v1/sales/order/conversion-rate?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch order conversion rate");
  }

  return response.json();
}

export async function getOrderCvr(params: OrderCvrParams): Promise<OrderCvrResponse[]> {
  const searchParams = new URLSearchParams();
  searchParams.append("period", params.period);
  searchParams.append("startDate", params.startDate);
  searchParams.append("endDate", params.endDate);

  const response = await fetchWithAuth(`/api/v1/sales/order/cvr?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch order CVR");
  }

  return response.json();
}

export async function getOrderKeywordTrend(params: OrderKeywordTrendParams): Promise<OrderKeywordTrendResponse[]> {
  const searchParams = new URLSearchParams();
  searchParams.append("period", params.period);
  searchParams.append("startDate", params.startDate);
  searchParams.append("endDate", params.endDate);

  const response = await fetchWithAuth(`/api/v1/sales/order/keyword-trend?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch order keyword trend");
  }

  return response.json();
}
