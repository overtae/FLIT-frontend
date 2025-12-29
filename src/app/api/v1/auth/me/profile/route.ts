import { NextRequest, NextResponse } from "next/server";

import { mockUserInfo } from "@/data/auth";
import { fetchWithAuth } from "@/lib/api/client";
import { USE_MOCK_DATA } from "@/lib/api/config";

export async function GET() {
  try {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return NextResponse.json(mockUserInfo);
    }

    const response = await fetchWithAuth("/auth/me/profile");

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const formData = await request.formData();
      const updatedUser = { ...mockUserInfo };
      for (const [key, value] of formData.entries()) {
        if (key !== "profileImage") {
          (updatedUser as any)[key] = value;
        }
      }
      // For profileImage, you might want to simulate a URL or just acknowledge it.
      if (formData.has("profileImage")) {
        updatedUser.profileImageUrl = "https://example.com/mock-profile-image.jpg";
      }
      return NextResponse.json(updatedUser);
    }

    const formData = await request.formData();
    const response = await fetchWithAuth("/auth/me/profile", {
      method: "PATCH",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user profile" }, { status: 500 });
  }
}
