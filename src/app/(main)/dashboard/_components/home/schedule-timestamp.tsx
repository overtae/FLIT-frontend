"use client";

import { useEffect, useState } from "react";

import { Clock } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getSchedules } from "@/service/schedule.service";
import { ScheduleItem } from "@/types/schedules";

export function ScheduleTimestamp() {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setIsLoading(true);
        const today = new Date().toISOString().split("T")[0];
        const response = await getSchedules({ date: today });
        setSchedules(response.data);
      } catch (error) {
        console.error("Failed to fetch schedules:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedules();
  }, []);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="size-5" />
          타임스탬프 뷰
        </CardTitle>
        <CardDescription>시간대별 일정을 확인하세요</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-muted-foreground flex items-center justify-center py-8 text-sm">로딩 중...</div>
            ) : schedules.length === 0 ? (
              <div className="text-muted-foreground flex items-center justify-center py-8 text-sm">일정이 없습니다</div>
            ) : (
              schedules.map((schedule) => (
                <div key={schedule.id} className="flex gap-4 border-b pb-4 last:border-0">
                  <div className="bg-muted flex min-w-[80px] flex-col items-center justify-center rounded-lg p-2">
                    <span className="text-sm font-semibold">{schedule.time}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{schedule.title}</h4>
                    {schedule.description && <p className="text-muted-foreground text-sm">{schedule.description}</p>}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
