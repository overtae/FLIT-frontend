import { NextRequest, NextResponse } from "next/server";

import { mockUsers } from "@/data/user";
import { fetchWithAuth } from "@/lib/api/client";
import { USE_MOCK_DATA } from "@/lib/api/config";

export async function GET(request: NextRequest) {
  try {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const { searchParams } = new URL(request.url);
      const name = searchParams.get("name");
      const grade = searchParams.get("grade") ?? "ALL";

      let filtered = [...mockUsers];
      if (name) {
        filtered = filtered.filter((u) => u.name.includes(name) || u.nickname.includes(name));
      }
      if (grade !== "ALL") {
        filtered = filtered.filter((u) => u.grade === grade);
      }

      return NextResponse.json(filtered);
    }

    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page");
    const size = searchParams.get("size");
    const name = searchParams.get("name");
    const joinDate = searchParams.get("joinDate");
    const grade = searchParams.get("grade") ?? "ALL";

    const params = new URLSearchParams();
    if (page) params.append("page", page);
    if (size) params.append("size", size);
    if (name) params.append("name", name);
    if (joinDate) params.append("joinDate", joinDate);
    params.append("grade", grade);

    const queryString = params.toString();
    const endpoint = queryString ? `/user?${queryString}` : "/user";

    const response = await fetchWithAuth(endpoint);

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
