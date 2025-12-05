"use client";

import { useState } from "react";

import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { AgeTab } from "./_components/age-tab";
import { GenderTab } from "./_components/gender-tab";

export default function CustomersPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="gender" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="gender">Gender</TabsTrigger>
            <TabsTrigger value="age">Age</TabsTrigger>
          </TabsList>

          <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[200px] justify-start text-left font-normal">
                <Calendar className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "yyyy년 MM월 dd일", { locale: ko }) : "날짜 선택"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  setIsDatePickerOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        <TabsContent value="gender" className="mt-6">
          <GenderTab selectedDate={selectedDate} />
        </TabsContent>
        <TabsContent value="age" className="mt-6">
          <AgeTab selectedDate={selectedDate} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
