"use client";

import { useEffect, useState } from "react";

import { Bell } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getNotifications, markNotificationAsRead } from "@/service/notification.service";
import type { Notification } from "@/types/auth.type";

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const response = await getNotifications();
        setNotifications(response);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      try {
        await markNotificationAsRead(notification.notificationId, { isRead: true });
        setNotifications((prev) =>
          prev.map((n) => (n.notificationId === notification.notificationId ? { ...n, isRead: true } : n)),
        );
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
      }
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="size-5" />
            알림
          </div>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unreadCount}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>최근 알림을 확인하세요</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-3">
            {isLoading ? (
              <div className="text-muted-foreground flex items-center justify-center py-8 text-sm">로딩 중...</div>
            ) : notifications.length === 0 ? (
              <div className="text-muted-foreground flex items-center justify-center py-8 text-sm">알림이 없습니다</div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.notificationId}
                  className={`cursor-pointer rounded-lg border p-3 transition-colors ${
                    notification.isRead ? "bg-muted/50" : "bg-background"
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{notification.title}</h4>
                        {!notification.isRead && <div className="bg-primary size-2 rounded-full" />}
                      </div>
                      <p className="text-muted-foreground text-sm">{notification.content}</p>
                      <p className="text-muted-foreground mt-1 text-xs">{notification.createdAt}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
        <Button variant="outline" className="mt-4 w-full">
          전체 알림 보기
        </Button>
      </CardContent>
    </Card>
  );
}
