"use client";

import * as React from "react";
import { useEffect } from "react";

import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getNotifications, markNotificationAsRead } from "@/service/notification.service";
import { Notification } from "@/types/notifications";

export function NotificationPopover() {
  const [open, setOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const response = await getNotifications();
        setNotifications(response.data);
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
        await markNotificationAsRead({ id: notification.id });
        setNotifications((prev) => prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n)));
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
      }
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const hasUnread = unreadCount > 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-sidebar-accent-foreground/10 hover:text-sidebar relative h-9 w-9"
        >
          <Bell className="size-5" />
          {hasUnread && (
            <span className="absolute top-1 right-1 flex size-2">
              <span className="bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
              <span className="bg-primary relative inline-flex size-2 rounded-full" />
            </span>
          )}
          <span className="sr-only">알림</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0" align="end">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-sm font-semibold">알림</h3>
          {hasUnread && <span className="text-muted-foreground text-xs">{unreadCount}개의 읽지 않은 알림</span>}
        </div>
        <ScrollArea className="h-[400px]">
          <div className="space-y-1 p-2">
            {isLoading ? (
              <div className="text-muted-foreground flex h-[200px] items-center justify-center text-sm">로딩 중...</div>
            ) : notifications.length === 0 ? (
              <div className="text-muted-foreground flex h-[200px] items-center justify-center text-sm">
                알림이 없습니다
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`hover:bg-accent cursor-pointer rounded-lg border p-3 transition-colors ${
                    notification.isRead ? "bg-muted/50" : "bg-background"
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold">{notification.title}</h4>
                        {!notification.isRead && <span className="bg-primary size-2 rounded-full" />}
                      </div>
                      <p className="text-muted-foreground text-sm">{notification.message}</p>
                      <p className="text-muted-foreground text-xs">{notification.time}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
