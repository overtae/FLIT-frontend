"use client";

import * as React from "react";
import { useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { Settings2 } from "lucide-react";

import { DailyRevenueChart } from "@/app/(main)/dashboard/sales/revenue/_components/daily-revenue-chart";
import { FilterPanel } from "@/app/(main)/dashboard/sales/revenue/_components/filter-panel";
import { MonthlyRevenueChart } from "@/app/(main)/dashboard/sales/revenue/_components/monthly-revenue-chart";
import { RevenueDashboard } from "@/app/(main)/dashboard/sales/revenue/_components/revenue-dashboard";
import { RevenueDetailTable } from "@/app/(main)/dashboard/sales/revenue/_components/revenue-detail-table";
import { WeeklyRevenueChart } from "@/app/(main)/dashboard/sales/revenue/_components/weekly-revenue-chart";
import { YearlyRevenueChart } from "@/app/(main)/dashboard/sales/revenue/_components/yearly-revenue-chart";
import { PasswordVerification } from "@/components/password-verification";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Tabs as SalesTabs,
  TabsContent as SalesTabsContent,
  TabsList as SalesTabsList,
  TabsTrigger as SalesTabsTrigger,
} from "../../_components/sales-tab";

interface RevenueContentProps {
  initialVerified: boolean;
}

export function RevenueContent({ initialVerified }: RevenueContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [activePeriodTab, setActivePeriodTab] = useState<"daily" | "weekly" | "monthly" | "yearly">("daily");
  const [paymentMethod, setPaymentMethod] = useState<"total" | "card" | "pos" | "transfer">("total");
  const [activeDetailTab, setActiveDetailTab] = useState<"all" | "shop" | "florist" | "order">("all");
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
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
      <RevenueDashboard selectedDate={selectedDate} onDateSelect={setSelectedDate} />

      <div className="space-y-4">
        <SalesTabs
          variant="fullWidth"
          spacing={0}
          value={activePeriodTab}
          onValueChange={(value) => setActivePeriodTab(value as typeof activePeriodTab)}
        >
          <SalesTabsList>
            <SalesTabsTrigger value="daily">일별 순매출</SalesTabsTrigger>
            <SalesTabsTrigger value="weekly">주별 순매출</SalesTabsTrigger>
            <SalesTabsTrigger value="monthly">월별 순매출</SalesTabsTrigger>
            <SalesTabsTrigger value="yearly">연별 순매출</SalesTabsTrigger>
          </SalesTabsList>
          <SalesTabsContent value="daily">
            <DailyRevenueChart paymentMethod={paymentMethod} onPaymentMethodChange={setPaymentMethod} />
          </SalesTabsContent>
          <SalesTabsContent value="weekly">
            <WeeklyRevenueChart paymentMethod={paymentMethod} onPaymentMethodChange={setPaymentMethod} />
          </SalesTabsContent>
          <SalesTabsContent value="monthly">
            <MonthlyRevenueChart paymentMethod={paymentMethod} onPaymentMethodChange={setPaymentMethod} />
          </SalesTabsContent>
          <SalesTabsContent value="yearly">
            <YearlyRevenueChart />
          </SalesTabsContent>
        </SalesTabs>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Tabs value={activeDetailTab} onValueChange={(value) => setActiveDetailTab(value as typeof activeDetailTab)}>
            <div className="overflow-x-auto">
              <TabsList className="inline-flex w-full min-w-max sm:w-auto">
                <TabsTrigger value="all" className="flex-1 text-xs whitespace-nowrap sm:flex-initial sm:text-sm">
                  All
                </TabsTrigger>
                <TabsTrigger value="shop" className="flex-1 text-xs whitespace-nowrap sm:flex-initial sm:text-sm">
                  Shop
                </TabsTrigger>
                <TabsTrigger value="florist" className="flex-1 text-xs whitespace-nowrap sm:flex-initial sm:text-sm">
                  Florist
                </TabsTrigger>
                <TabsTrigger value="order" className="flex-1 text-xs whitespace-nowrap sm:flex-initial sm:text-sm">
                  수발주
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
              onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            >
              <Settings2 className="text-muted-foreground h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="sr-only">필터 설정</span>
            </Button>
          </div>
        </div>
        <FilterPanel open={isFilterPanelOpen} onOpenChange={setIsFilterPanelOpen} />
        <RevenueDetailTable category={activeDetailTab} />
      </div>
    </div>
  );
}
