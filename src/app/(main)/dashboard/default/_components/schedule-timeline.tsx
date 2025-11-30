"use client";

import { useMemo, useState } from "react";

import { isPast, setHours, setMinutes } from "date-fns";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import { ScheduleEvent } from "./schedule-data";
import { ScheduleDetailCard } from "./schedule-detail-card";

interface ScheduleTimelineProps {
  events: ScheduleEvent[];
  selectedDate?: Date;
}

interface TimelineItemProps {
  event: ScheduleEvent;
  isLeft: boolean;
  isOpen: boolean;
  isPastEvent: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate?: Date;
}

const getDotColor = (type: "green" | "orange", isPast: boolean, isOpen: boolean) => {
  if (isOpen) return "bg-main";
  if (isPast) return "bg-gray-300";
  return type === "green" ? "bg-green-400" : "bg-orange-400";
};

const getTextColor = (isPast: boolean, isOpen: boolean) => {
  if (isOpen) return "text-main";
  if (isPast) return "text-gray-400";
  return "text-gray-900";
};

function TimelineItem({ event, isLeft, isOpen, isPastEvent, onOpenChange, selectedDate }: TimelineItemProps) {
  const dotColorClass = cn(
    "mt-1.5 h-2 w-2 shrink-0 rounded-full transition-colors",
    getDotColor(event.type, isPastEvent, isOpen),
  );

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

  return (
    <div className={containerClass}>
      <Popover open={isOpen} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <button className={buttonClass}>
            <div className={dotColorClass} />
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-gray-500">{event.time}</span>
              <span className={textColorClass}>{event.title}</span>
            </div>
          </button>
        </PopoverTrigger>

        <PopoverContent
          className="w-80 border-none p-0 shadow-xl"
          side="bottom"
          align={isLeft ? "end" : "center"}
          sideOffset={10}
        >
          <ScheduleDetailCard date={selectedDate} events={[event]} onClose={() => onOpenChange(false)} />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function ScheduleTimeline({ events, selectedDate }: ScheduleTimelineProps) {
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);

  // 공통 시간 파싱 로직
  const parseEventHour = (eventTime: string) => {
    const [timeStr, period] = eventTime.split(" ");
    const [hStr] = timeStr.split(":");
    let h = parseInt(hStr);

    // 12시간제/24시간제 혼용 데이터 처리
    // 이미 12 이상인 경우(13:00 pm 등)는 더하지 않음
    if (period === "pm" && h < 12) h += 12;
    if (period === "am" && h === 12) h = 0;

    return h;
  };

  // 일정이 있는 시간대만 추출하여 정렬
  const activeHours = useMemo(() => {
    if (events.length === 0) return [9, 12, 15, 18];

    const hoursSet = new Set<number>();
    events.forEach((e) => {
      const h = parseEventHour(e.time);
      // 유효한 시간(0~23)만 추가
      if (h >= 0 && h <= 23) {
        hoursSet.add(h);
      }
    });

    return Array.from(hoursSet).sort((a, b) => a - b);
  }, [events]);

  const getEventsBetween = (startHour: number) => {
    return events.filter((event) => {
      const h = parseEventHour(event.time);
      return h === startHour;
    });
  };

  const isEventPast = (eventTime: string) => {
    if (!selectedDate) return false;

    const [timeStr] = eventTime.split(" ");
    const [, minutesStr] = timeStr.split(":");
    const eventHour = parseEventHour(eventTime);
    const minutes = parseInt(minutesStr);

    const eventDateTime = setMinutes(setHours(selectedDate, eventHour), minutes);
    return isPast(eventDateTime);
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
                const hourEvents = getEventsBetween(hour);

                return (
                  <div key={hour} className="relative">
                    <div className="relative z-10 flex justify-center py-6">
                      <span className="bg-white px-1 text-sm font-bold text-gray-800">{hour}</span>
                    </div>

                    <div className="relative min-h-[60px]">
                      {hourEvents.map((event, idx) => {
                        const isLeft = idx % 2 === 0;
                        const isOpen = openPopoverId === event.id;
                        const isPastEvent = isEventPast(event.time);

                        return (
                          <TimelineItem
                            key={event.id}
                            event={event}
                            isLeft={isLeft}
                            isOpen={isOpen}
                            isPastEvent={isPastEvent}
                            onOpenChange={(open) => setOpenPopoverId(open ? event.id : null)}
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
