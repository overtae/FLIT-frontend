"use client";

import { useState } from "react";

import { Filter, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { DailyRevenueChart } from "./_components/daily-revenue-chart";
import { FilterPanel } from "./_components/filter-panel";
import { MonthlyRevenueChart } from "./_components/monthly-revenue-chart";
import { RevenueDashboard } from "./_components/revenue-dashboard";
import { RevenueDetailTable } from "./_components/revenue-detail-table";
import { WeeklyRevenueChart } from "./_components/weekly-revenue-chart";
import { YearlyRevenueChart } from "./_components/yearly-revenue-chart";

export default function RevenuePage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [activePeriodTab, setActivePeriodTab] = useState<"daily" | "weekly" | "monthly" | "yearly">("daily");
  const [paymentMethod, setPaymentMethod] = useState<"total" | "card" | "pos" | "transfer">("total");
  const [activeDetailTab, setActiveDetailTab] = useState<"all" | "shop" | "florist" | "order">("all");
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* 최상단 섹션: 매출 현황 대시보드 */}
      <RevenueDashboard selectedDate={selectedDate} onDateSelect={setSelectedDate} />

      {/* 중단 섹션: 기간별 순매출 추이 */}
      <div className="space-y-4">
        <Tabs value={activePeriodTab} onValueChange={(value) => setActivePeriodTab(value as typeof activePeriodTab)}>
          <TabsList>
            <TabsTrigger value="daily">일별 순매출</TabsTrigger>
            <TabsTrigger value="weekly">주별 순매출</TabsTrigger>
            <TabsTrigger value="monthly">월별 순매출</TabsTrigger>
            <TabsTrigger value="yearly">연별 순매출</TabsTrigger>
          </TabsList>
          <TabsContent value="daily" className="mt-4">
            <DailyRevenueChart paymentMethod={paymentMethod} onPaymentMethodChange={setPaymentMethod} />
          </TabsContent>
          <TabsContent value="weekly" className="mt-4">
            <WeeklyRevenueChart paymentMethod={paymentMethod} onPaymentMethodChange={setPaymentMethod} />
          </TabsContent>
          <TabsContent value="monthly" className="mt-4">
            <MonthlyRevenueChart paymentMethod={paymentMethod} onPaymentMethodChange={setPaymentMethod} />
          </TabsContent>
          <TabsContent value="yearly" className="mt-4">
            <YearlyRevenueChart />
          </TabsContent>
        </Tabs>
      </div>

      {/* 하단 섹션: 매출 상세 내역 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Tabs value={activeDetailTab} onValueChange={(value) => setActiveDetailTab(value as typeof activeDetailTab)}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="shop">Shop</TabsTrigger>
              <TabsTrigger value="florist">Florist</TabsTrigger>
              <TabsTrigger value="order">수발주</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Input placeholder="검색..." className="w-[200px] rounded-full pl-8" />
              <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
            </div>
            <Button variant="outline" size="icon" onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}>
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <FilterPanel open={isFilterPanelOpen} onOpenChange={setIsFilterPanelOpen} />
        <RevenueDetailTable />
      </div>
    </div>
  );
}
