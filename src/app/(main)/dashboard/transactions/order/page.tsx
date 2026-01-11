"use client";

import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { TransactionList } from "../_components/transaction-list";

export default function OrderPage() {
  const [activeTab, setActiveTab] = useState<"all" | "shop" | "florist">("all");

  return (
    <div className="space-y-4 sm:space-y-6">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "all" | "shop" | "florist")}
        className="w-full"
      >
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="all" className="flex-1 sm:flex-initial">
            All
          </TabsTrigger>
          <TabsTrigger value="shop" className="flex-1 sm:flex-initial">
            Shop
          </TabsTrigger>
          <TabsTrigger value="florist" className="flex-1 sm:flex-initial">
            Florist
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-3 sm:mt-4">
          <TransactionList category="order" subCategory="all" />
        </TabsContent>
        <TabsContent value="shop" className="mt-3 sm:mt-4">
          <TransactionList category="order" subCategory="shop" />
        </TabsContent>
        <TabsContent value="florist" className="mt-3 sm:mt-4">
          <TransactionList category="order" subCategory="florist" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
