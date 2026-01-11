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
import { formatNumberShort } from "@/lib/chart-utils";
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
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base sm:text-lg">카테고리별 일매출 현황</CardTitle>
              <CardDescription className="text-xs sm:text-sm">막대그래프</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <ResponsiveContainer width="100%" height={300} className="sm:h-[400px]">
            <BarChart data={categoryData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} className="sm:text-xs" />
              <YAxis tickFormatter={formatNumberShort} tick={{ fontSize: 10 }} className="sm:text-xs" />
              <Tooltip formatter={(value: number) => formatNumberShort(value)} contentStyle={{ fontSize: "12px" }} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar dataKey="value" fill="#8884d8" name="매출" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base sm:text-lg">일/주/월별 순매출</CardTitle>
              <CardDescription className="text-xs sm:text-sm">꺾은선 그래프</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select defaultValue="day">
                <SelectTrigger className="w-28 text-xs sm:w-32 sm:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day" className="text-xs sm:text-sm">
                    일별
                  </SelectItem>
                  <SelectItem value="week" className="text-xs sm:text-sm">
                    주별
                  </SelectItem>
                  <SelectItem value="month" className="text-xs sm:text-sm">
                    월별
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <ResponsiveContainer width="100%" height={300} className="sm:h-[400px]">
            <LineChart data={dailyRevenue} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} className="sm:text-xs" />
              <YAxis tickFormatter={formatNumberShort} tick={{ fontSize: 10 }} className="sm:text-xs" />
              <Tooltip formatter={(value: number) => formatNumberShort(value)} contentStyle={{ fontSize: "12px" }} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                name="순매출"
                strokeWidth={1.5}
                className="sm:stroke-[2px]"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">연별 순매출</CardTitle>
          <CardDescription className="text-xs sm:text-sm">쌓인막대그래프 + 곡선형 라인 그래프</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <ResponsiveContainer width="100%" height={300} className="sm:h-[400px]">
            <ComposedChart data={yearlyData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fontSize: 10 }} className="sm:text-xs" />
              <YAxis tickFormatter={formatNumberShort} tick={{ fontSize: 10 }} className="sm:text-xs" />
              <Tooltip formatter={(value: number) => formatNumberShort(value)} contentStyle={{ fontSize: "12px" }} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar dataKey="value" fill="#8884d8" name="순매출" />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#ff7300"
                name="순매출 추이"
                strokeWidth={1.5}
                className="sm:stroke-[2px]"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
