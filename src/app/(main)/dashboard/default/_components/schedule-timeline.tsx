"use client";

import { useMemo, useState } from "react";

import { isPast, isToday, setHours, setMinutes } from "date-fns";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { Schedule } from "@/types/schedule.type";

import { ScheduleDetailCard } from "./schedule-detail-card";

interface ScheduleTimelineProps {
  schedules: Schedule[];
  selectedDate?: Date;
}

interface TimelineItemProps {
  schedule: Schedule;
  isLeft: boolean;
  isOpen: boolean;
  isPastEvent: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate?: Date;
}

function formatTime(timeStr: string): string {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const period = hours >= 12 ? "pm" : "am";
  const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  return `${displayHour}:${minutes.toString().padStart(2, "0")} ${period}`;
}

const getDotColor = (isPast: boolean, isOpen: boolean) => {
  if (isOpen) return "bg-main";
  if (isPast) return "bg-gray-300";
  return "bg-green-400";
};

const getTextColor = (isPast: boolean, isOpen: boolean) => {
  if (isOpen) return "text-main";
  if (isPast) return "text-gray-400";
  return "text-gray-900";
};

function TimelineItem({ schedule, isLeft, isOpen, isPastEvent, onOpenChange, selectedDate }: TimelineItemProps) {
  const dotColorClass = cn("mt-1.5 h-2 w-2 shrink-0 rounded-full transition-colors", getDotColor(isPastEvent, isOpen));

  const textColorClass = cn("text-sm font-medium transition-colors", getTextColor(isPastEvent, isOpen));

  const containerClass = cn(
    "mb-6 flex w-full items-center",
    isLeft ? "justify-end pr-[50%] pl-4" : "justify-start pr-4 pl-[50%]",
  );

  const buttonClass = cn(
    "group relative flex items-start gap-3 text-left transition-all hover:opacity-80",
    isLeft ? "flex-row-reverse text-right" : "flex-row",
    isLeft ? "mr-4" : "ml-4",
  );

  const displayTime = formatTime(schedule.startTime);

  return (
    <div className={containerClass}>
      <Popover open={isOpen} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <button className={buttonClass}>
            <div className={dotColorClass} />
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-gray-500">{displayTime}</span>
              <span className={textColorClass}>{schedule.title}</span>
            </div>
          </button>
        </PopoverTrigger>

        <PopoverContent
          className="w-80 border-none p-0 shadow-xl"
          side="bottom"
          align={isLeft ? "end" : "center"}
          sideOffset={10}
        >
          <ScheduleDetailCard date={selectedDate} schedules={[schedule]} onClose={() => onOpenChange(false)} />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function ScheduleTimeline({ schedules, selectedDate }: ScheduleTimelineProps) {
  const [openPopoverId, setOpenPopoverId] = useState<number | null>(null);

  // startTime의 hour를 key로 하는 Map 생성
  const schedulesByHour = useMemo(() => {
    const map = new Map<number, Schedule[]>();
    schedules.forEach((schedule) => {
      const [hours] = schedule.startTime.split(":").map(Number);
      const existing = map.get(hours) ?? [];
      map.set(hours, [...existing, schedule]);
    });
    return map;
  }, [schedules]);

  // 일정이 있는 시간대만 추출하여 정렬
  const activeHours = useMemo(() => {
    if (schedules.length === 0) return [9, 12, 15, 18];

    return Array.from(schedulesByHour.keys()).sort((a, b) => a - b);
  }, [schedulesByHour, schedules.length]);

  const getSchedulesBetween = (startHour: number) => {
    return schedulesByHour.get(startHour) ?? [];
  };

  const isSchedulePast = (schedule: Schedule) => {
    if (!selectedDate) return false;

    const today = new Date();
    const isSelectedDatePast = !isToday(selectedDate) && selectedDate < today;

    if (isSelectedDatePast) return true;

    if (!isToday(selectedDate)) return false;

    const [hours, minutes] = schedule.startTime.split(":").map(Number);
    const scheduleDateTime = setMinutes(setHours(selectedDate, hours), minutes);
    return isPast(scheduleDateTime);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-transparent pt-4">
      <div className="mb-6 flex items-center justify-center border-b border-gray-100 pb-4">
        <h2 className="text-lg font-semibold text-gray-700">플릿일정</h2>
      </div>

      <div className="min-h-0 w-full flex-1">
        <ScrollArea className="h-full w-full">
          <div className="relative min-h-[400px] px-4 pt-2 pb-20">
            <div className="absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 border-l border-dashed border-gray-300" />

            {activeHours.length > 0 ? (
              activeHours.map((hour) => {
                const hourSchedules = getSchedulesBetween(hour);

                return (
                  <div key={hour} className="relative">
                    <div className="relative z-10 flex justify-center py-6">
                      <span className="bg-white px-1 text-sm font-bold text-gray-800">{hour}</span>
                    </div>

                    <div className="relative min-h-[60px]">
                      {hourSchedules.map((schedule, idx) => {
                        const isLeft = idx % 2 === 0;
                        const isOpen = openPopoverId === schedule.scheduleId;
                        const isPastEvent = isSchedulePast(schedule);

                        return (
                          <TimelineItem
                            key={schedule.scheduleId}
                            schedule={schedule}
                            isLeft={isLeft}
                            isOpen={isOpen}
                            isPastEvent={isPastEvent}
                            onOpenChange={(open) => setOpenPopoverId(open ? schedule.scheduleId : null)}
                            selectedDate={selectedDate}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex h-full items-center justify-center py-20 text-gray-400">일정이 없습니다.</div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
