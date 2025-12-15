"use client";

import { useEffect, useState } from "react";

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
import { getProductCategoryData, getProductDailyRevenue, getProductYearlyData } from "@/service/chart.service";
import { CategoryChartData, RevenueChartData } from "@/types/dashboard";

export function ProductDashboard() {
  const [categoryData, setCategoryData] = useState<CategoryChartData[]>([]);
  const [dailyRevenue, setDailyRevenue] = useState<RevenueChartData[]>([]);
  const [yearlyData, setYearlyData] = useState<RevenueChartData[]>([]);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const [category, daily, yearly] = await Promise.all([
          getProductCategoryData(),
          getProductDailyRevenue(),
          getProductYearlyData(),
        ]);
        setCategoryData(category);
        setDailyRevenue(daily);
        setYearlyData(yearly);
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      }
    };

    fetchChartData();
  }, []);
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
