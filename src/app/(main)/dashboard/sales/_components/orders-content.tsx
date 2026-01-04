"use client";

import { useState } from "react";

import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Calendar } from "lucide-react";

import { PasswordVerification } from "@/components/password-verification";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ConversionRateChart } from "../orders/_components/conversion-rate-chart";
import { CvrChart } from "../orders/_components/cvr-chart";
import { SearchTrendTable } from "../orders/_components/search-trend-table";

import {
  Tabs as OTabs,
  TabsContent as OTabsContent,
  TabsList as OTabsList,
  TabsTrigger as OTabsTrigger,
} from "./sales-tabs";

interface OrdersContentProps {
  initialVerified: boolean;
}

export function OrdersContent({ initialVerified }: OrdersContentProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<"weekly" | "monthly" | "yearly">("weekly");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [activeChartTab, setActiveChartTab] = useState<"cvr" | "search">("cvr");

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
    <div className="flex min-h-screen flex-col space-y-6 pb-24">
      <Tabs
        value={selectedPeriod}
        onValueChange={(value) => setSelectedPeriod(value as "weekly" | "monthly" | "yearly")}
      >
        <TabsList>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="yearly">Yearly</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid flex-1 grid-cols-5 gap-6 pt-24 pb-32">
        <div className="col-span-2 flex h-full w-full items-center justify-center">
          <ConversionRateChart period={selectedPeriod} />
        </div>

        <div className="col-span-3 h-full">
          <OTabs
            value={activeChartTab}
            onValueChange={(value) => setActiveChartTab(value as "cvr" | "search")}
            className="flex h-full flex-col"
          >
            <div className="flex items-center justify-between">
              <OTabsList>
                <OTabsTrigger value="cvr">CVR | 구매전환율</OTabsTrigger>
                <OTabsTrigger value="search">검색어 트렌드</OTabsTrigger>
              </OTabsList>
              <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="w-[150px] justify-start text-left font-normal">
                    <Calendar className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "yyyy-MM-dd", { locale: ko }) : "날짜 선택"}
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
            <OTabsContent value="cvr" className="flex grow flex-col items-center justify-center">
              <CvrChart period={selectedPeriod} selectedDate={selectedDate} />
            </OTabsContent>
            <OTabsContent value="search" className="flex grow flex-col items-center justify-center">
              <SearchTrendTable period={selectedPeriod} selectedDate={selectedDate} />
            </OTabsContent>
          </OTabs>
        </div>
      </div>
    </div>
  );
}
