import { NextResponse } from "next/server";

import { mockNotifications } from "@/data/auth";
import { fetchWithAuth } from "@/lib/api/client";
import { USE_MOCK_DATA } from "@/lib/api/config";

export async function GET() {
  try {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const unreadCount = mockNotifications.filter((n) => !n.isRead).length;
      return NextResponse.json(unreadCount);
    }

    const response = await fetchWithAuth("/auth/me/notification/unread");

    if (!response.ok) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }

    const count = await response.text();
    return NextResponse.json(Number(count));
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch unread notification count" }, { status: 500 });
  }
}
