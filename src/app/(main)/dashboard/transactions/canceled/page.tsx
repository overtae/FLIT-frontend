"use client";

import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { TransactionList } from "../_components/transaction-list";

export default function CanceledPage() {
  const [activeTab, setActiveTab] = useState<"shop" | "florist" | "order-request">("shop");

  return (
    <div className="space-y-4 sm:space-y-6">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "shop" | "florist" | "order-request")}
        className="w-full"
      >
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="shop" className="flex-1 sm:flex-initial">
            Shop
          </TabsTrigger>
          <TabsTrigger value="florist" className="flex-1 sm:flex-initial">
            Florist
          </TabsTrigger>
          <TabsTrigger value="order-request" className="flex-1 sm:flex-initial">
            수발주
          </TabsTrigger>
        </TabsList>
        <TabsContent value="shop" className="mt-3 sm:mt-4">
          <TransactionList category="canceled" subCategory="shop" />
        </TabsContent>
        <TabsContent value="florist" className="mt-3 sm:mt-4">
          <TransactionList category="canceled" subCategory="florist" />
        </TabsContent>
        <TabsContent value="order-request" className="mt-3 sm:mt-4">
          <TransactionList category="canceled" subCategory="order-request" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
