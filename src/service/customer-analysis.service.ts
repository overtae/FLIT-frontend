import { CustomerAnalysisParams, CustomerAnalysisResponse } from "@/types/customer-analysis";

export async function getCustomerAnalysis(params?: CustomerAnalysisParams): Promise<CustomerAnalysisResponse> {
  const searchParams = new URLSearchParams();
  if (params?.period) {
    searchParams.append("period", params.period);
  }
  if (params?.date) {
    searchParams.append("date", params.date);
  }

  const response = await fetch(`/api/dashboard/customer-analysis?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch customer analysis");
  }

  return response.json();
}
