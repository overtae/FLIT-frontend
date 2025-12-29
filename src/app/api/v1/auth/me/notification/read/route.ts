import { NextRequest, NextResponse } from "next/server";

import { mockNotifications } from "@/data/auth";
import { fetchWithAuth } from "@/lib/api/client";
import { USE_MOCK_DATA } from "@/lib/api/config";

export async function POST(request: NextRequest) {
  try {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const body = await request.json();
      const { notificationIds } = body as { notificationIds: number[] };

      // mockNotifications에서 해당 ID들의 isRead를 true로 설정
      notificationIds.forEach((id) => {
        const notification = mockNotifications.find((n) => n.notificationId === id);
        if (notification) {
          notification.isRead = true;
        }
      });

      return NextResponse.json({ success: true });
    }

    const body = await request.json();
    const response = await fetchWithAuth("/auth/me/notification/read", {
      method: "POST",
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to mark notifications as read" }, { status: 500 });
  }
}
