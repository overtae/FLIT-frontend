import { NextRequest, NextResponse } from "next/server";

import { fetchWithAuth } from "@/lib/api/client";
import { USE_MOCK_DATA } from "@/lib/api/config";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ notificationId: string }> }) {
  try {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return NextResponse.json({ success: true });
    }

    const { notificationId } = await params;
    const body = await request.json();
    const response = await fetchWithAuth(`/auth/me/notification/${notificationId}/read`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to mark notification as read" }, { status: 500 });
  }
}
