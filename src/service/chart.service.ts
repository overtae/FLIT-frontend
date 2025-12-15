import { ChartDataPoint, CategoryChartData, RevenueChartData } from "@/types/dashboard";

export async function getVisitorsChartData(): Promise<ChartDataPoint[]> {
  const response = await fetch("/api/dashboard/charts/visitors");
  if (!response.ok) {
    throw new Error("Failed to fetch visitors chart data");
  }

  return response.json();
}

export async function getRevenueDailyData(): Promise<RevenueChartData[]> {
  const response = await fetch("/api/dashboard/charts/revenue/daily");
  if (!response.ok) {
    throw new Error("Failed to fetch revenue daily data");
  }

  return response.json();
}

export async function getRevenueYearlyData(): Promise<RevenueChartData[]> {
  const response = await fetch("/api/dashboard/charts/revenue/yearly");
  if (!response.ok) {
    throw new Error("Failed to fetch revenue yearly data");
  }

  return response.json();
}

export async function getProductCategoryData(): Promise<CategoryChartData[]> {
  const response = await fetch("/api/dashboard/charts/products/category");
  if (!response.ok) {
    throw new Error("Failed to fetch product category data");
  }

  return response.json();
}

export async function getProductDailyRevenue(): Promise<RevenueChartData[]> {
  const response = await fetch("/api/dashboard/charts/products/daily");
  if (!response.ok) {
    throw new Error("Failed to fetch product daily revenue");
  }

  return response.json();
}

export async function getProductYearlyData(): Promise<RevenueChartData[]> {
  const response = await fetch("/api/dashboard/charts/products/yearly");
  if (!response.ok) {
    throw new Error("Failed to fetch product yearly data");
  }

  return response.json();
}

export async function getCategoryChartData(viewMode: "group" | "product"): Promise<CategoryChartData[]> {
  const response = await fetch(`/api/dashboard/charts/products/category-group?viewMode=${viewMode}`);
  if (!response.ok) {
    throw new Error("Failed to fetch category chart data");
  }

  return response.json();
}
