import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { CustomerDashboard } from "./_components/customer-dashboard";
import { OrderDashboard } from "./_components/order-dashboard";
import { ProductDashboard } from "./_components/product-dashboard";
import { RevenueDashboard } from "./_components/revenue-dashboard";

export default function SalesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">매출관리</h1>
        <p className="text-muted-foreground mt-2">매출 정보를 분석하세요</p>
      </div>

      <Tabs defaultValue="revenue" className="w-full">
        <TabsList>
          <TabsTrigger value="revenue">매출분석</TabsTrigger>
          <TabsTrigger value="products">상품분석</TabsTrigger>
          <TabsTrigger value="customers">고객분석</TabsTrigger>
          <TabsTrigger value="orders">주문분석</TabsTrigger>
        </TabsList>
        <TabsContent value="revenue" className="mt-6">
          <RevenueDashboard />
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
