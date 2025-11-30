"use client";

import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { ScheduleEvent } from "./schedule-data";

interface ScheduleDetailCardProps {
  date: Date | undefined;
  events: ScheduleEvent[];
  onClose: () => void;
}

export function ScheduleDetailCard({ date, events, onClose }: ScheduleDetailCardProps) {
  if (!date) {
    return null;
  }

  const groupedEvents = events.reduce(
    (acc, event) => {
      const timeKey = event.time;
      if (!acc[timeKey]) {
        acc[timeKey] = [];
      }
      acc[timeKey].push(event);
      return acc;
    },
    {} as Record<string, ScheduleEvent[]>,
  );

  return (
    <Card className="w-full max-w-md border-none shadow-none">
      <CardContent className="space-y-4 px-4">
        <div className="space-y-3">
          {Object.entries(groupedEvents).map(([time, timeEvents]) => (
            <div key={time} className="space-y-2">
              {timeEvents.map((event, index) => (
                <div key={event.id} className="space-y-1">
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "mt-1.5 h-2 w-2 shrink-0 rounded-full transition-colors",
                        event.type === "green" ? "bg-green-400" : "bg-orange-400",
                      )}
                    />
                    <div className="space-y-1">
                      <p className="text-muted-foreground min-w-[60px] text-sm font-medium">
                        {event.time}
                        {event.endTime && ` - ${event.endTime}`}
                      </p>
                      <div className="flex-1">
                        <div className="font-medium">{event.title}</div>
                        {event.description && <div className="text-muted-foreground text-sm">{event.description}</div>}
                      </div>
                    </div>
                  </div>
                  {index < timeEvents.length - 1 && <div className="border-border border-b" />}
                </div>
              ))}
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
