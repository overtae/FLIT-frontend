"use client";

import { Clock } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  description?: string;
}

const mockSchedules: ScheduleItem[] = [
  { id: "1", time: "09:00", title: "팀 미팅", description: "주간 회의" },
  { id: "2", time: "11:30", title: "고객 상담", description: "신규 고객" },
  { id: "3", time: "14:00", title: "프로젝트 리뷰", description: "진행 상황 점검" },
  { id: "4", time: "16:30", title: "문서 작성", description: "보고서 작성" },
];

export function ScheduleTimestamp() {
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
            {mockSchedules.map((schedule) => (
              <div key={schedule.id} className="flex gap-4 border-b pb-4 last:border-0">
                <div className="bg-muted flex min-w-[80px] flex-col items-center justify-center rounded-lg p-2">
                  <span className="text-sm font-semibold">{schedule.time}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{schedule.title}</h4>
                  {schedule.description && <p className="text-muted-foreground text-sm">{schedule.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
