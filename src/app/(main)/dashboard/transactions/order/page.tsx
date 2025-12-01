"use client";

import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { TransactionList } from "../_components/transaction-list";

export default function OrderPage() {
  const [activeTab, setActiveTab] = useState<"all" | "shop" | "florist">("all");

  return (
    <div className="space-y-6">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "all" | "shop" | "florist")}
        className="w-full"
      >
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="shop">Shop</TabsTrigger>
          <TabsTrigger value="florist">Florist</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <TransactionList category="order" subCategory="all" />
        </TabsContent>
        <TabsContent value="shop">
          <TransactionList category="order" subCategory="shop" />
        </TabsContent>
        <TabsContent value="florist">
          <TransactionList category="order" subCategory="florist" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
