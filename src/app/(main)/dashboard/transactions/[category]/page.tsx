"use client";

import { useEffect } from "react";

import { useParams, useRouter } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { TransactionList } from "../_components/transaction-list";

const validCategories = ["order", "order-request", "canceled"];

const categoryLabels: Record<string, string> = {
  order: "Order",
  "order-request": "수발주",
  canceled: "Canceled",
};

export default function TransactionsCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const category = params.category as string;

  useEffect(() => {
    if (category && !validCategories.includes(category)) {
      router.replace("/dashboard/transactions");
    }
  }, [category, router]);

  if (!category || !validCategories.includes(category)) {
    return null;
  }

  const getSubCategories = () => {
    if (category === "canceled") {
      return [{ value: "order-request", label: "수발주" }];
    }
    return [
      { value: "all", label: "All" },
      { value: "shop", label: "Shop" },
      { value: "florist", label: "Florist" },
    ];
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">거래관리 - {categoryLabels[category]}</h1>
        <p className="text-muted-foreground mt-2">거래 내역을 관리하세요</p>
      </div>

      <Tabs defaultValue={getSubCategories()[0].value} className="w-full">
        <TabsList>
          {getSubCategories().map((sub) => (
            <TabsTrigger key={sub.value} value={sub.value}>
              {sub.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {getSubCategories().map((sub) => (
          <TabsContent key={sub.value} value={sub.value} className="mt-4">
            <TransactionList category={category} subCategory={sub.value} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
