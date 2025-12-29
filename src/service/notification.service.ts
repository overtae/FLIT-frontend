import { fetchWithAuth } from "@/lib/api/client-fetch";
import type { Notification, MarkNotificationReadRequest, MarkNotificationsReadRequest } from "@/types/auth.type";

export async function getNotifications(): Promise<Notification[]> {
  const response = await fetchWithAuth("/api/v1/auth/me/notification");
  if (!response.ok) {
    throw new Error("Failed to fetch notifications");
  }

  return response.json();
}

export async function getUnreadNotificationCount(): Promise<number> {
  const response = await fetchWithAuth("/api/v1/auth/me/notification/unread");
  if (!response.ok) {
    throw new Error("Failed to fetch unread notification count");
  }

  const count = await response.text();
  return Number(count);
}

export async function markNotificationsAsRead(data: MarkNotificationsReadRequest): Promise<void> {
  const response = await fetchWithAuth("/api/v1/auth/me/notification/read", {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to mark notifications as read");
  }

  await response.json();
}

export async function markNotificationAsRead(
  notificationId: number,
  data: MarkNotificationReadRequest,
): Promise<unknown> {
  const response = await fetchWithAuth(`/api/v1/auth/me/notification/${notificationId}/read`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to mark notification as read");
  }

  return response.json();
}

export async function deleteNotification(notificationId: number): Promise<void> {
  const response = await fetchWithAuth(`/api/v1/auth/me/notification/${notificationId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete notification");
  }
}
