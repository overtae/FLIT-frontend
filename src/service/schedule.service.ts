import { fetchWithAuth } from "@/lib/api/client-fetch";
import type { ScheduleParams, Schedule } from "@/types/schedule.type";

export async function getSchedules(params?: ScheduleParams): Promise<Schedule[]> {
  const searchParams = new URLSearchParams();
  if (params?.year) searchParams.append("year", params.year);
  if (params?.month) searchParams.append("month", params.month);

  const queryString = searchParams.toString();
  const endpoint = queryString ? `/api/v1/schedule?${queryString}` : "/api/v1/schedule";

  const response = await fetchWithAuth(endpoint);
  if (!response.ok) {
    throw new Error("Failed to fetch schedules");
  }

  return response.json();
}
