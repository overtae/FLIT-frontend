"use client";

import { useState } from "react";

import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Calendar } from "lucide-react";

import { PasswordVerification } from "@/components/password-verification";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { AgeTab } from "../customers/_components/age-tab";
import { GenderTab } from "../customers/_components/gender-tab";

interface CustomersContentProps {
  initialVerified: boolean;
}

export function CustomersContent({ initialVerified }: CustomersContentProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  if (!initialVerified) {
    return (
      <PasswordVerification
        title="비밀번호 재확인"
        description="매출관리에 접근하기 위해 비밀번호를 입력해주세요."
        page="sales"
        onVerified={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <Tabs defaultValue="gender" className="w-full">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="overflow-x-auto">
            <TabsList className="inline-flex w-full min-w-max sm:w-auto">
              <TabsTrigger value="gender" className="flex-1 text-xs whitespace-nowrap sm:flex-initial sm:text-sm">
                Gender
              </TabsTrigger>
              <TabsTrigger value="age" className="flex-1 text-xs whitespace-nowrap sm:flex-initial sm:text-sm">
                Age
              </TabsTrigger>
            </TabsList>
          </div>

          <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left text-xs font-normal sm:w-[200px] sm:text-sm"
              >
                <Calendar className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
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

        <TabsContent value="gender" className="mt-4 sm:mt-6">
          <GenderTab selectedDate={selectedDate} />
        </TabsContent>
        <TabsContent value="age" className="mt-4 sm:mt-6">
          <AgeTab selectedDate={selectedDate} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
