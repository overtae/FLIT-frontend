"use client";

import * as React from "react";
import { useEffect, useCallback } from "react";

import { Bell, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationsAsRead,
  deleteNotification,
} from "@/service/notification.service";
import type { Notification } from "@/types/auth.type";

export function NotificationPopover() {
  const [open, setOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);

  // 닫힌 상태에서 읽지 않은 알림 개수만 가져오기
  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!open) {
        try {
          const count = await getUnreadNotificationCount();
          setUnreadCount(count);
        } catch (error) {
          console.error("Failed to fetch unread notification count:", error);
        }
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // 30초마다 갱신

    return () => clearInterval(interval);
  }, [open]);

  // 팝오버가 열릴 때 알림 목록 가져오기
  useEffect(() => {
    const fetchNotifications = async () => {
      if (open) {
        try {
          setIsLoading(true);
          const data = await getNotifications();
          setNotifications(data);
        } catch (error) {
          console.error("Failed to fetch notifications:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchNotifications();
  }, [open]);

  // 팝오버가 닫힐 때 읽지 않은 알림들을 일괄 읽음 처리
  const handleOpenChange = useCallback(
    async (newOpen: boolean) => {
      if (!newOpen && open) {
        // 팝오버가 닫힐 때
        const unreadNotifications = notifications.filter((n) => !n.isRead);
        if (unreadNotifications.length > 0) {
          try {
            await markNotificationsAsRead({
              notificationIds: unreadNotifications.map((n) => n.notificationId),
            });
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
            setUnreadCount(0);
          } catch (error) {
            console.error("Failed to mark notifications as read:", error);
          }
        }
      }
      setOpen(newOpen);
    },
    [open, notifications],
  );

  const handleDelete = async (e: React.MouseEvent, notificationId: number) => {
    e.stopPropagation();
    try {
      await deleteNotification(notificationId);
      setNotifications((prev) => prev.filter((n) => n.notificationId !== notificationId));
      // 읽지 않은 알림이었다면 카운트 감소
      const deletedNotification = notifications.find((n) => n.notificationId === notificationId);
      if (deletedNotification && !deletedNotification.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "방금 전";
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    return date.toLocaleDateString("ko-KR");
  };

  const hasUnread = unreadCount > 0;

  const currentUnreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
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
          {currentUnreadCount > 0 && (
            <span className="text-muted-foreground text-xs">{currentUnreadCount}개의 읽지 않은 알림</span>
          )}
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
                  key={notification.notificationId}
                  className={`hover:bg-accent cursor-pointer rounded-lg border p-3 transition-colors ${
                    notification.isRead ? "bg-muted/50" : "bg-background"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold">{notification.title}</h4>
                        {!notification.isRead && <span className="bg-primary size-2 rounded-full" />}
                      </div>
                      <p className="text-muted-foreground text-sm">{notification.content}</p>
                      <p className="text-muted-foreground text-xs">{formatDate(notification.createdAt)}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      onClick={(e) => handleDelete(e, notification.notificationId)}
                    >
                      <Trash2 className="size-4" />
                      <span className="sr-only">삭제</span>
                    </Button>
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
