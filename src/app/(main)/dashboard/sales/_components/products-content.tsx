"use client";

import { useState } from "react";
import * as React from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Calendar, ChevronDown, Search, Settings2 } from "lucide-react";

import { PasswordVerification } from "@/components/password-verification";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { CategorySalesChart } from "../products/_components/category-sales-chart";
import { DailySalesChart } from "../products/_components/daily-sales-chart";
import { FilterPanel } from "../products/_components/filter-panel";
import { MonthlySalesChart } from "../products/_components/monthly-sales-chart";
import { SalesDetailTable } from "../products/_components/sales-detail-table";
import { WeeklySalesChart } from "../products/_components/weekly-sales-chart";
import { YearlySalesChart } from "../products/_components/yearly-sales-chart";

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
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-foreground text-lg font-semibold">카테고리별 일매출 현황</h2>
          <div className="flex items-center gap-4">
            <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[250px] justify-start text-left font-normal">
                  <Calendar className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "yyyy년 MM월 dd일 EEEE", { locale: ko }) : "날짜 선택"}
                  <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
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
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="group" id="group" />
                  <Label htmlFor="group">그룹별</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="product" id="product" />
                  <Label htmlFor="product">상품별</Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        </div>
        <CategorySalesChart viewMode={viewMode} selectedDate={selectedDate} onCategoryClick={setSelectedCategory} />
      </div>

      <div className="space-y-4">
        <Tabs value={activePeriodTab} onValueChange={(value) => setActivePeriodTab(value as typeof activePeriodTab)}>
          <TabsList>
            <TabsTrigger value="daily">일별 순매출</TabsTrigger>
            <TabsTrigger value="weekly">주별 순매출</TabsTrigger>
            <TabsTrigger value="monthly">월별 순매출</TabsTrigger>
            <TabsTrigger value="yearly">연별 순매출</TabsTrigger>
          </TabsList>
          <TabsContent value="daily" className="mt-4">
            <DailySalesChart
              selectedCategory={selectedCategory}
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
            />
          </TabsContent>
          <TabsContent value="weekly" className="mt-4">
            <WeeklySalesChart
              selectedCategory={selectedCategory}
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
            />
          </TabsContent>
          <TabsContent value="monthly" className="mt-4">
            <MonthlySalesChart
              selectedCategory={selectedCategory}
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
            />
          </TabsContent>
          <TabsContent value="yearly" className="mt-4">
            <YearlySalesChart selectedCategory={selectedCategory} />
          </TabsContent>
        </Tabs>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Tabs defaultValue="all" className="w-auto">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="flower">꽃</TabsTrigger>
              <TabsTrigger value="plant">식물</TabsTrigger>
              <TabsTrigger value="wreath">화환</TabsTrigger>
              <TabsTrigger value="space">공간연출</TabsTrigger>
              <TabsTrigger value="subscription">정기배송</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Input
                placeholder="검색..."
                className="w-[200px] pl-8"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const params = new URLSearchParams(searchParams.toString());
                    if (searchInput.trim()) {
                      params.set("search", searchInput.trim());
                    } else {
                      params.delete("search");
                    }
                    router.push(`?${params.toString()}`, { scroll: false });
                  }
                }}
              />
              <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setIsFilterModalOpen(!isFilterModalOpen)}
            >
              <Settings2 className="text-muted-foreground h-4 w-4" />
              <span className="sr-only">필터 설정</span>
            </Button>
          </div>
        </div>
        <FilterPanel open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen} />
        <SalesDetailTable />
      </div>
    </div>
  );
}
