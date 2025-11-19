"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  ComposedChart,
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const categoryData = [
  { category: "꽃", revenue: 4000 },
  { category: "식물", revenue: 3000 },
  { category: "화환", revenue: 2000 },
  { category: "공간연출", revenue: 2780 },
  { category: "정기배송", revenue: 1890 },
];

const dailyRevenue = [
  { date: "1일", revenue: 4000 },
  { date: "2일", revenue: 3000 },
  { date: "3일", revenue: 2000 },
  { date: "4일", revenue: 2780 },
  { date: "5일", revenue: 1890 },
];

const yearlyData = [
  { year: "2020", revenue: 400 },
  { year: "2021", revenue: 300 },
  { year: "2022", revenue: 200 },
  { year: "2023", revenue: 278 },
  { year: "2024", revenue: 189 },
];

export function ProductDashboard() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>카테고리별 일매출 현황</CardTitle>
              <CardDescription>막대그래프</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#8884d8" name="매출" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>일/주/월별 순매출</CardTitle>
              <CardDescription>꺾은선 그래프</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select defaultValue="day">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">일별</SelectItem>
                  <SelectItem value="week">주별</SelectItem>
                  <SelectItem value="month">월별</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={dailyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="순매출" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>연별 순매출</CardTitle>
          <CardDescription>쌓인막대그래프 + 곡선형 라인 그래프</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={yearlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#8884d8" name="순매출" />
              <Line type="monotone" dataKey="revenue" stroke="#ff7300" name="순매출 추이" />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
