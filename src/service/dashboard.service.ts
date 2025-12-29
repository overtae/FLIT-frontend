import { fetchWithAuth } from "@/lib/api/client-fetch";
import { DashboardSection } from "@/types/dashboard";

export async function getDashboardSections(): Promise<DashboardSection[]> {
  const response = await fetchWithAuth("/api/dashboard/sections");
  if (!response.ok) {
    throw new Error("Failed to fetch dashboard sections");
  }

  return response.json();
}
