"use client";

import { useState, useEffect } from "react";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatNumberShort } from "@/lib/chart-utils";
import { getOrderCvr, getOrderKeywordTrend } from "@/service/sales.service";

export function OrderDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<"WEEKLY" | "MONTHLY" | "YEARLY">("WEEKLY");
  const [cvrData, setCvrData] = useState<Array<{ period: string; cvr: number }>>([]);
  const [searchTrendData, setSearchTrendData] = useState<
    Array<{ keyword: string; search: number; bounceRate: number }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const today = new Date();
        let startDate: string;
        const endDate = today.toISOString().split("T")[0];

        if (selectedPeriod === "WEEKLY") {
          const start = new Date(today);
          start.setDate(today.getDate() - 6);
          startDate = start.toISOString().split("T")[0];
        } else if (selectedPeriod === "MONTHLY") {
          const start = new Date(today.getFullYear(), today.getMonth(), 1);
          startDate = start.toISOString().split("T")[0];
        } else {
          const start = new Date(today.getFullYear(), 0, 1);
          startDate = start.toISOString().split("T")[0];
        }

        const [cvrResponse, keywordTrendResponse] = await Promise.all([
          getOrderCvr({
            period: selectedPeriod,
            startDate,
            endDate,
          }),
          getOrderKeywordTrend({
            period: selectedPeriod,
            startDate,
            endDate,
          }),
        ]);

        const cvrDataList: Array<{ period: string; cvr: number }> = cvrResponse.map((item, index) => ({
          period: `Day ${index + 1}`,
          cvr: item.current,
        }));
        setCvrData(cvrDataList);

        const searchTrendDataList: Array<{ keyword: string; search: number; bounceRate: number }> =
          keywordTrendResponse.map((item) => ({
            keyword: item.keyword,
            search: item.searchCount,
            bounceRate: item.bounceRate,
          }));
        setSearchTrendData(searchTrendDataList);
      } catch (error) {
        console.error("Failed to fetch order dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedPeriod]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }
  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base sm:text-lg">기간 선택</CardTitle>
            <Tabs
              value={selectedPeriod.toLowerCase()}
              onValueChange={(value) => setSelectedPeriod(value.toUpperCase() as typeof selectedPeriod)}
            >
              <div className="overflow-x-auto">
                <TabsList className="inline-flex w-full min-w-max sm:w-auto">
                  <TabsTrigger value="weekly" className="flex-1 text-xs whitespace-nowrap sm:flex-initial sm:text-sm">
                    주간
                  </TabsTrigger>
                  <TabsTrigger value="monthly" className="flex-1 text-xs whitespace-nowrap sm:flex-initial sm:text-sm">
                    월간
                  </TabsTrigger>
                  <TabsTrigger value="yearly" className="flex-1 text-xs whitespace-nowrap sm:flex-initial sm:text-sm">
                    연간
                  </TabsTrigger>
                </TabsList>
              </div>
            </Tabs>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">CVR (구매전환율)</CardTitle>
          <CardDescription className="text-xs sm:text-sm">꺾은선그래프</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <ResponsiveContainer width="100%" height={300} className="sm:h-[400px]">
            <LineChart data={cvrData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" tick={{ fontSize: 10 }} className="sm:text-xs" />
              <YAxis tickFormatter={(value) => `${value}%`} tick={{ fontSize: 10 }} className="sm:text-xs" />
              <Tooltip formatter={(value: number) => `${value}%`} contentStyle={{ fontSize: "12px" }} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Line
                type="monotone"
                dataKey="cvr"
                stroke="#8884d8"
                name="CVR (%)"
                strokeWidth={1.5}
                className="sm:stroke-[2px]"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">검색어 트렌드 순위</CardTitle>
          <CardDescription className="text-xs sm:text-sm">keyword, search, bounce rate</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full min-w-[400px]">
              <thead className="bg-muted">
                <tr>
                  <th className="px-2 py-1.5 text-left text-xs sm:px-4 sm:py-2 sm:text-sm">Keyword</th>
                  <th className="px-2 py-1.5 text-right text-xs sm:px-4 sm:py-2 sm:text-sm">Search</th>
                  <th className="px-2 py-1.5 text-right text-xs sm:px-4 sm:py-2 sm:text-sm">Bounce Rate</th>
                </tr>
              </thead>
              <tbody>
                {searchTrendData.map((item) => (
                  <tr key={item.keyword} className="border-b">
                    <td className="px-2 py-1.5 text-xs break-words sm:px-4 sm:py-2 sm:text-sm">{item.keyword}</td>
                    <td className="px-2 py-1.5 text-right text-xs sm:px-4 sm:py-2 sm:text-sm">
                      {item.search.toLocaleString()}
                    </td>
                    <td className="px-2 py-1.5 text-right text-xs sm:px-4 sm:py-2 sm:text-sm">{item.bounceRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
