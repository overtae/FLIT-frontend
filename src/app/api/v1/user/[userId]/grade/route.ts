import { NextRequest, NextResponse } from "next/server";

import { fetchWithAuth } from "@/lib/api/client";
import { USE_MOCK_DATA } from "@/lib/api/config";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const body = await request.json();
      return NextResponse.json({ success: true, grade: body.grade });
    }

    const { userId } = await params;
    const body = await request.json();
    const response = await fetchWithAuth(`/user/${userId}/grade`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user grade" }, { status: 500 });
  }
}
