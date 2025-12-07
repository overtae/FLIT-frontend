"use client";

import { useState } from "react";

import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Calendar, ChevronDown, Filter, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { CategorySalesChart } from "./_components/category-sales-chart";
import { DailySalesChart } from "./_components/daily-sales-chart";
import { FilterPanel } from "./_components/filter-panel";
import { MonthlySalesChart } from "./_components/monthly-sales-chart";
import { SalesDetailTable } from "./_components/sales-detail-table";
import { WeeklySalesChart } from "./_components/weekly-sales-chart";
import { YearlySalesChart } from "./_components/yearly-sales-chart";

export default function ProductsPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"group" | "product">("group");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activePeriodTab, setActivePeriodTab] = useState<"daily" | "weekly" | "monthly" | "yearly">("daily");
  const [paymentMethod, setPaymentMethod] = useState<"total" | "card" | "pos" | "transfer">("total");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* 상단 섹션: 카테고리별 일매출 현황 */}
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

      {/* 하단 섹션: 기간별 순매출 분석 */}
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

      {/* 하단 섹션: 매출 상세 내역 */}
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
              <Input placeholder="검색..." className="w-[200px] pl-8" />
              <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
            </div>
            <Button variant="outline" size="icon" onClick={() => setIsFilterModalOpen(!isFilterModalOpen)}>
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <FilterPanel open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen} />
        <SalesDetailTable />
      </div>
    </div>
  );
}
