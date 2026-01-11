"use client";

import { useState } from "react";
import * as React from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Calendar, ChevronDown, Settings2 } from "lucide-react";

import { PasswordVerification } from "@/components/password-verification";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SearchInput } from "@/components/ui/search-input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Tabs as SalesTabs,
  TabsContent as SalesTabsContent,
  TabsList as SalesTabsList,
  TabsTrigger as SalesTabsTrigger,
} from "../../_components/sales-tab";

import { CategorySalesChart } from "./category-sales-chart";
import { DailySalesChart } from "./daily-sales-chart";
import { FilterPanel } from "./filter-panel";
import { MonthlySalesChart } from "./monthly-sales-chart";
import { SalesDetailTable } from "./sales-detail-table";
import { WeeklySalesChart } from "./weekly-sales-chart";
import { YearlySalesChart } from "./yearly-sales-chart";

interface ProductsContentProps {
  initialVerified: boolean;
}

export function ProductsContent({ initialVerified }: ProductsContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"group" | "product">("group");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activePeriodTab, setActivePeriodTab] = useState<"daily" | "weekly" | "monthly" | "yearly">("daily");
  const [paymentMethod, setPaymentMethod] = useState<"total" | "card" | "pos" | "transfer">("total");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchParams.get("search") ?? "");
  const [activeDetailTab, setActiveDetailTab] = useState<
    "all" | "flower" | "plant" | "wreath" | "space" | "subscription"
  >("all");

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
      <div className="space-y-3 sm:space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-foreground text-base font-semibold sm:text-lg">카테고리별 일매출 현황</h2>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left text-xs font-normal sm:w-[250px] sm:text-sm"
                >
                  <Calendar className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  {selectedDate ? format(selectedDate, "yyyy년 MM월 dd일 EEEE", { locale: ko }) : "날짜 선택"}
                  <ChevronDown className="ml-auto h-3.5 w-3.5 opacity-50 sm:h-4 sm:w-4" />
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
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <RadioGroup value={viewMode} onValueChange={(value) => setViewMode(value as "group" | "product")}>
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <RadioGroupItem value="group" id="group" className="h-4 w-4 sm:h-5 sm:w-5" />
                  <Label htmlFor="group" className="text-xs sm:text-sm">
                    그룹별
                  </Label>
                </div>
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <RadioGroupItem value="product" id="product" className="h-4 w-4 sm:h-5 sm:w-5" />
                  <Label htmlFor="product" className="text-xs sm:text-sm">
                    상품별
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        </div>
        <CategorySalesChart viewMode={viewMode} selectedDate={selectedDate} onCategoryClick={setSelectedCategory} />
      </div>

      <div className="space-y-4">
        <SalesTabs
          value={activePeriodTab}
          onValueChange={(value) => setActivePeriodTab(value as typeof activePeriodTab)}
        >
          <SalesTabsList>
            <SalesTabsTrigger value="daily">일별 순매출</SalesTabsTrigger>
            <SalesTabsTrigger value="weekly">주별 순매출</SalesTabsTrigger>
            <SalesTabsTrigger value="monthly">월별 순매출</SalesTabsTrigger>
            <SalesTabsTrigger value="yearly">연별 순매출</SalesTabsTrigger>
          </SalesTabsList>
          <SalesTabsContent value="daily" className="p-4">
            <DailySalesChart
              selectedCategory={selectedCategory}
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
            />
          </SalesTabsContent>
          <SalesTabsContent value="weekly" className="p-4">
            <WeeklySalesChart
              selectedCategory={selectedCategory}
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
            />
          </SalesTabsContent>
          <SalesTabsContent value="monthly" className="p-4">
            <MonthlySalesChart
              selectedCategory={selectedCategory}
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
            />
          </SalesTabsContent>
          <SalesTabsContent value="yearly" className="p-4">
            <YearlySalesChart selectedCategory={selectedCategory} />
          </SalesTabsContent>
        </SalesTabs>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Tabs
            value={activeDetailTab}
            onValueChange={(value) => setActiveDetailTab(value as typeof activeDetailTab)}
            className="w-auto"
          >
            <div className="overflow-x-auto">
              <TabsList className="inline-flex w-full min-w-max sm:w-auto">
                <TabsTrigger value="all" className="flex-1 text-xs whitespace-nowrap sm:flex-initial sm:text-sm">
                  All
                </TabsTrigger>
                <TabsTrigger value="flower" className="flex-1 text-xs whitespace-nowrap sm:flex-initial sm:text-sm">
                  꽃
                </TabsTrigger>
                <TabsTrigger value="plant" className="flex-1 text-xs whitespace-nowrap sm:flex-initial sm:text-sm">
                  식물
                </TabsTrigger>
                <TabsTrigger value="wreath" className="flex-1 text-xs whitespace-nowrap sm:flex-initial sm:text-sm">
                  화환
                </TabsTrigger>
                <TabsTrigger value="space" className="flex-1 text-xs whitespace-nowrap sm:flex-initial sm:text-sm">
                  공간연출
                </TabsTrigger>
                <TabsTrigger
                  value="subscription"
                  className="flex-1 text-xs whitespace-nowrap sm:flex-initial sm:text-sm"
                >
                  정기배송
                </TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
          <div className="flex items-center gap-2">
            <SearchInput
              value={searchInput}
              onChange={setSearchInput}
              onEnter={(value) => {
                const params = new URLSearchParams(searchParams.toString());
                if (value.trim()) {
                  params.set("search", value.trim());
                } else {
                  params.delete("search");
                }
                router.push(`?${params.toString()}`, { scroll: false });
              }}
              placeholder="검색"
              iconPosition="right"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 sm:h-9 sm:w-9"
              onClick={() => setIsFilterModalOpen(!isFilterModalOpen)}
            >
              <Settings2 className="text-muted-foreground h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="sr-only">필터 설정</span>
            </Button>
          </div>
        </div>
        <FilterPanel open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen} />
        <SalesDetailTable category={activeDetailTab} />
      </div>
    </div>
  );
}
