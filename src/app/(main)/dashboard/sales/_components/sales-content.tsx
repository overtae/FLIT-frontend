"use client";

import { useState } from "react";

import { PasswordVerification } from "@/components/password-verification";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { RevenueDashboard } from "../revenue/_components/revenue-dashboard";

import { CustomerDashboard } from "./customer-dashboard";
import { OrderDashboard } from "./order-dashboard";
import { ProductDashboard } from "./product-dashboard";

interface SalesContentProps {
  initialVerified: boolean;
}

export function SalesContent({ initialVerified }: SalesContentProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

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
      <div>
        <h1 className="text-foreground text-xl font-bold">매출관리</h1>
        <p className="text-secondary-foreground mt-2 text-sm">매출 정보를 분석하세요</p>
      </div>

      <Tabs defaultValue="revenue" className="w-full">
        <TabsList>
          <TabsTrigger value="revenue">매출분석</TabsTrigger>
          <TabsTrigger value="products">상품분석</TabsTrigger>
          <TabsTrigger value="customers">고객분석</TabsTrigger>
          <TabsTrigger value="orders">주문분석</TabsTrigger>
        </TabsList>
        <TabsContent value="revenue" className="mt-6">
          <RevenueDashboard selectedDate={selectedDate} onDateSelect={setSelectedDate} />
        </TabsContent>
        <TabsContent value="products" className="mt-6">
          <ProductDashboard />
        </TabsContent>
        <TabsContent value="customers" className="mt-6">
          <CustomerDashboard />
        </TabsContent>
        <TabsContent value="orders" className="mt-6">
          <OrderDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
