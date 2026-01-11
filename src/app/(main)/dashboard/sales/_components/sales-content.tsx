"use client";

import { useState } from "react";

import { PasswordVerificationProvider } from "@/components/providers/password-verification-provider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ProductDashboard } from "../products/_components/product-dashboard";
import { RevenueDashboard } from "../revenue/_components/revenue-dashboard";

import { CustomerDashboard } from "./customer-dashboard";
import { OrderDashboard } from "./order-dashboard";

interface SalesContentProps {
  initialVerified: boolean;
}

export function SalesContent({ initialVerified }: SalesContentProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  return (
    <PasswordVerificationProvider initialVerified={initialVerified}>
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-foreground text-lg font-bold sm:text-xl">매출관리</h1>
          <p className="text-secondary-foreground mt-1 text-xs sm:mt-2 sm:text-sm">매출 정보를 분석하세요</p>
        </div>

        <Tabs defaultValue="revenue" className="w-full">
          <div className="overflow-x-auto">
            <TabsList className="inline-flex w-full min-w-max sm:w-auto">
              <TabsTrigger value="revenue" className="flex-1 whitespace-nowrap sm:flex-initial">
                매출분석
              </TabsTrigger>
              <TabsTrigger value="products" className="flex-1 whitespace-nowrap sm:flex-initial">
                상품분석
              </TabsTrigger>
              <TabsTrigger value="customers" className="flex-1 whitespace-nowrap sm:flex-initial">
                고객분석
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex-1 whitespace-nowrap sm:flex-initial">
                주문분석
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="revenue" className="mt-4 sm:mt-6">
            <RevenueDashboard selectedDate={selectedDate} onDateSelect={setSelectedDate} />
          </TabsContent>
          <TabsContent value="products" className="mt-4 sm:mt-6">
            <ProductDashboard />
          </TabsContent>
          <TabsContent value="customers" className="mt-4 sm:mt-6">
            <CustomerDashboard />
          </TabsContent>
          <TabsContent value="orders" className="mt-4 sm:mt-6">
            <OrderDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </PasswordVerificationProvider>
  );
}
