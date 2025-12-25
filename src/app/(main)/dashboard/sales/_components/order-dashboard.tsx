"use client";

import { useState, useEffect } from "react";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getOrderDashboardData } from "@/lib/api/dashboard";

export function OrderDashboard() {
  const [cvrData, setCvrData] = useState<Array<{ period: string; cvr: number }>>([]);
  const [searchTrendData, setSearchTrendData] = useState<
    Array<{ keyword: string; search: number; bounceRate: number }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getOrderDashboardData();
        setCvrData(data.cvrData);
        setSearchTrendData(data.searchTrendData);
      } catch (error) {
        console.error("Failed to fetch order dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>기간 선택</CardTitle>
            <Tabs defaultValue="week">
              <TabsList>
                <TabsTrigger value="week">주간</TabsTrigger>
                <TabsTrigger value="month">월간</TabsTrigger>
                <TabsTrigger value="year">연간</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>CVR (구매전환율)</CardTitle>
          <CardDescription>꺾은선그래프</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={cvrData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="cvr" stroke="#8884d8" name="CVR (%)" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>검색어 트렌드 순위</CardTitle>
          <CardDescription>keyword, search, bounce rate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-md border">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-2 text-left">Keyword</th>
                  <th className="px-4 py-2 text-right">Search</th>
                  <th className="px-4 py-2 text-right">Bounce Rate</th>
                </tr>
              </thead>
              <tbody>
                {searchTrendData.map((item) => (
                  <tr key={item.keyword} className="border-b">
                    <td className="px-4 py-2">{item.keyword}</td>
                    <td className="px-4 py-2 text-right">{item.search.toLocaleString()}</td>
                    <td className="px-4 py-2 text-right">{item.bounceRate}%</td>
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
