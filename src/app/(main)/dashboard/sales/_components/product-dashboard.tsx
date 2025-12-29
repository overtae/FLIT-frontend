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
import { getProductCategory, getProductNet, getProductNetYearly } from "@/service/sales.service";
import type { ProductCategoryResponse, ProductNetResponse, ProductNetYearlyResponse } from "@/types/sales.type";

export function ProductDashboard() {
  const [categoryData, setCategoryData] = useState<ProductCategoryResponse[]>([]);
  const [dailyRevenue, setDailyRevenue] = useState<ProductNetResponse["current"]>([]);
  const [yearlyData, setYearlyData] = useState<ProductNetYearlyResponse[]>([]);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const today = new Date();
        const todayStr = today.toISOString().split("T")[0];
        const startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 30);
        const startDateStr = startDate.toISOString().split("T")[0];
        const startYear = (today.getFullYear() - 4).toString();
        const endYear = today.getFullYear().toString();

        const [categoryResponse, dailyResponse, yearlyResponse] = await Promise.all([
          getProductCategory({ targetDate: todayStr, category: "PRODUCT" }),
          getProductNet({ period: "DAILY", startDate: startDateStr, endDate: todayStr }),
          getProductNetYearly({ startYear, endYear }),
        ]);

        setCategoryData(categoryResponse);
        setDailyRevenue(dailyResponse.current);
        setYearlyData(yearlyResponse);
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
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" name="매출" />
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
              <Line type="monotone" dataKey="value" stroke="#8884d8" name="순매출" />
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
              <Bar dataKey="value" fill="#8884d8" name="순매출" />
              <Line type="monotone" dataKey="value" stroke="#ff7300" name="순매출 추이" />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
