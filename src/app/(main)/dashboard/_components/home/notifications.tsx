"use client";

import { Bell } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "새로운 주문",
    message: "새로운 주문이 접수되었습니다.",
    time: "5분 전",
    isRead: false,
  },
  {
    id: "2",
    title: "배송 완료",
    message: "주문 #12345의 배송이 완료되었습니다.",
    time: "1시간 전",
    isRead: false,
  },
  {
    id: "3",
    title: "시스템 업데이트",
    message: "시스템이 업데이트되었습니다.",
    time: "2시간 전",
    isRead: true,
  },
];

export function Notifications() {
  const unreadCount = mockNotifications.filter((n) => !n.isRead).length;

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
            {mockNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-lg border p-3 ${notification.isRead ? "bg-muted/50" : "bg-background"}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{notification.title}</h4>
                      {!notification.isRead && <div className="bg-primary size-2 rounded-full" />}
                    </div>
                    <p className="text-muted-foreground text-sm">{notification.message}</p>
                    <p className="text-muted-foreground mt-1 text-xs">{notification.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <Button variant="outline" className="mt-4 w-full">
          전체 알림 보기
        </Button>
      </CardContent>
    </Card>
  );
}
