"use client";

import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { TransactionList } from "../_components/transaction-list";

export default function CanceledPage() {
  const [activeTab, setActiveTab] = useState<"shop" | "florist" | "order-request">("shop");

  return (
    <div className="space-y-6">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "shop" | "florist" | "order-request")}
        className="w-full"
      >
        <TabsList>
          <TabsTrigger value="shop">Shop</TabsTrigger>
          <TabsTrigger value="florist">Florist</TabsTrigger>
          <TabsTrigger value="order-request">수발주</TabsTrigger>
        </TabsList>
        <TabsContent value="shop" className="mt-4">
          <TransactionList category="canceled" subCategory="shop" />
        </TabsContent>
        <TabsContent value="florist" className="mt-4">
          <TransactionList category="canceled" subCategory="florist" />
        </TabsContent>
        <TabsContent value="order-request" className="mt-4">
          <TransactionList category="canceled" subCategory="order-request" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
