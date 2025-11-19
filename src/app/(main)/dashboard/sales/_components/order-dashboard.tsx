"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const cvrData = [
  { period: "1주", cvr: 2.5 },
  { period: "2주", cvr: 3.0 },
  { period: "3주", cvr: 2.8 },
  { period: "4주", cvr: 3.2 },
  { period: "5주", cvr: 3.5 },
];

const searchTrendData = [
  { keyword: "장미", search: 1000, bounceRate: 25.5 },
  { keyword: "화분", search: 800, bounceRate: 30.2 },
  { keyword: "꽃다발", search: 600, bounceRate: 28.1 },
  { keyword: "식물", search: 500, bounceRate: 32.5 },
  { keyword: "화환", search: 400, bounceRate: 27.8 },
];

export function OrderDashboard() {
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
                {searchTrendData.map((item, index) => (
                  <tr key={index} className="border-b">
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
