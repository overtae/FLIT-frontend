import { Notification, NotificationReadRequest, NotificationReadAllRequest } from "@/types/notifications";

export async function getNotifications(params?: { isRead?: boolean }): Promise<{
  data: Notification[];
  total: number;
}> {
  const searchParams = new URLSearchParams();
  if (params?.isRead !== undefined) {
    searchParams.append("isRead", params.isRead.toString());
  }

  const response = await fetch(`/api/dashboard/notifications?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch notifications");
  }

  return response.json();
}

export async function markNotificationAsRead(request: NotificationReadRequest): Promise<{
  success: boolean;
  message: string;
}> {
  const response = await fetch("/api/dashboard/notifications", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("Failed to mark notification as read");
  }

  return response.json();
}

export async function markAllNotificationsAsRead(request: NotificationReadAllRequest): Promise<{
  success: boolean;
  message: string;
}> {
  const response = await fetch("/api/dashboard/notifications", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("Failed to mark all notifications as read");
  }

  return response.json();
}
