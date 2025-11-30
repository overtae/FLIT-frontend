"use client";

import * as React from "react";

import { Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function UserFilter() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const grades = ["Green", "Yellow", "Orange", "Red", "Silver", "Gold"];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Settings2 className="text-muted-foreground h-4 w-4" />
          <span className="sr-only">필터 설정</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-4" align="end">
        <div className="space-y-4">
          {/* Grade Filter */}
          <div className="space-y-3">
            {grades.map((grade) => (
              <div key={grade} className="flex items-center space-x-2">
                <Checkbox id={`filter-${grade}`} />
                <Label
                  htmlFor={`filter-${grade}`}
                  className="text-sm leading-none font-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {grade}
                </Label>
              </div>
            ))}
            <div className="mt-2 flex items-center space-x-2 border-t pt-1">
              <Checkbox id="filter-date" defaultChecked />
              <Label htmlFor="filter-date" className="text-sm font-normal">
                날짜선택
              </Label>
            </div>
          </div>

          {/* Date Picker (Simplified for visual match) */}
          <div className="rounded-md border shadow-sm">
            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus className="p-2" />
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 pt-2">
            <Button className="h-8 w-full rounded-full bg-gray-600 text-xs text-white hover:bg-gray-700">Reset</Button>
            <Button variant="outline" className="h-8 w-full rounded-full border-gray-200 text-xs">
              Done
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
