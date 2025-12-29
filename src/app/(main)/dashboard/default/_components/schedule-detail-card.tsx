"use client";

import { isPast, isToday, setHours, setMinutes } from "date-fns";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Schedule } from "@/types/schedule.type";

interface ScheduleDetailCardProps {
  date: Date | undefined;
  schedules: Schedule[];
  onClose: () => void;
}

function formatTime(timeStr: string): string {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const period = hours >= 12 ? "pm" : "am";
  const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  return `${displayHour}:${minutes.toString().padStart(2, "0")} ${period}`;
}

export function ScheduleDetailCard({ date, schedules, onClose }: ScheduleDetailCardProps) {
  if (!date) {
    return null;
  }

  const isSchedulePast = (schedule: Schedule) => {
    const today = new Date();
    const isSelectedDatePast = !isToday(date) && date < today;
    if (isSelectedDatePast) return true;
    if (!isToday(date)) return false;

    const [hours, minutes] = schedule.startTime.split(":").map(Number);
    const scheduleDateTime = setMinutes(setHours(date, hours), minutes);
    return isPast(scheduleDateTime);
  };

  const groupedSchedules = schedules.reduce(
    (acc, schedule) => {
      const timeKey = formatTime(schedule.startTime);
      if (!(timeKey in acc)) {
        const newArray: Schedule[] = [];
        acc[timeKey] = newArray;
      }
      const timeSchedules = acc[timeKey];
      if (timeSchedules) {
        timeSchedules.push(schedule);
      }
      return acc;
    },
    {} as Record<string, Schedule[]>,
  );

  return (
    <Card className="w-full max-w-md border-none shadow-none">
      <CardContent className="space-y-4 px-0">
        <div className="space-y-3">
          {Object.entries(groupedSchedules).map(([time, timeSchedules]) => (
            <div key={time} className="space-y-2">
              {timeSchedules.map((schedule, index) => {
                const past = isSchedulePast(schedule);
                return (
                  <div key={schedule.scheduleId} className="space-y-1">
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          "mt-1.5 h-2 w-2 shrink-0 rounded-full transition-colors",
                          past ? "bg-gray-300" : "bg-green-400",
                        )}
                      />
                      <div className="space-y-1">
                        <p className="text-muted-foreground min-w-[60px] text-sm font-medium">
                          {time}
                          {schedule.endTime && ` - ${formatTime(schedule.endTime)}`}
                        </p>
                        <div className="flex-1">
                          <div className="font-medium">{schedule.title}</div>
                          {schedule.content && <div className="text-muted-foreground text-sm">{schedule.content}</div>}
                        </div>
                      </div>
                    </div>
                    {index < timeSchedules.length - 1 && <div className="border-border border-b" />}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t pt-4">
          <Button variant="ghost" className="h-auto p-0 text-sm hover:bg-transparent" asChild>
            <a href="#" className="flex items-center text-gray-500 hover:text-gray-900">
              <ArrowRight className="mr-1 h-4 w-4" />
              일정으로 이동
            </a>
          </Button>
          <Button size="sm" onClick={onClose} className="bg-gray-900 text-white hover:bg-gray-800">
            OK
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
