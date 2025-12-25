import { NextRequest, NextResponse } from "next/server";

import { mockNotifications } from "@/data/notifications";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const isRead = searchParams.get("isRead");

  let filteredNotifications = [...mockNotifications];

  if (isRead !== null) {
    const isReadBool = isRead === "true";
    filteredNotifications = filteredNotifications.filter((n) => n.isRead === isReadBool);
  }

  return NextResponse.json({
    data: filteredNotifications,
    total: filteredNotifications.length,
  });
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ids } = body;

    if (ids && Array.isArray(ids)) {
      mockNotifications.forEach((notification) => {
        if (ids.includes(notification.id)) {
          notification.isRead = true;
        }
      });
      return NextResponse.json({ success: true, message: "알림이 읽음 처리되었습니다." });
    }

    if (id) {
      const notification = mockNotifications.find((n) => n.id === id);
      if (notification) {
        notification.isRead = true;
        return NextResponse.json({ success: true, message: "알림이 읽음 처리되었습니다." });
      }
      return NextResponse.json({ success: false, message: "알림을 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json({ success: false, message: "잘못된 요청입니다." }, { status: 400 });
  } catch {
    return NextResponse.json({ success: false, message: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
