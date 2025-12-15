"use client";

import { useEffect, useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Bar,
  ComposedChart,
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getRevenueDailyData, getRevenueYearlyData } from "@/service/chart.service";
import { RevenueChartData } from "@/types/dashboard";

export function RevenueDashboard() {
  const [dailyData, setDailyData] = useState<RevenueChartData[]>([]);
  const [yearlyData, setYearlyData] = useState<RevenueChartData[]>([]);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const [daily, yearly] = await Promise.all([getRevenueDailyData(), getRevenueYearlyData()]);
        setDailyData(daily);
        setYearlyData(yearly);
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      }
    };

    fetchChartData();
  }, []);
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>최종 업데이트 일시</CardDescription>
            <CardTitle className="text-sm">2024-01-15 14:30</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>총 매출액</CardDescription>
            <CardTitle className="text-2xl">12,345,678원</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>결제금액</CardDescription>
            <CardTitle className="text-2xl">10,000,000원</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>결제건수</CardDescription>
            <CardTitle className="text-2xl">1,234건</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>배송중</CardDescription>
            <CardTitle className="text-2xl">56건</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>환불/취소 금액</CardDescription>
            <CardTitle className="text-2xl">500,000원</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>환불/취소 건수</CardDescription>
            <CardTitle className="text-2xl">10건</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>배송완료건수</CardDescription>
            <CardTitle className="text-2xl">1,000건</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>일/주/월별 순매출</CardTitle>
              <CardDescription>총매출/카드결제/현장결제(POS)/계좌이체</CardDescription>
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
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total" stroke="#8884d8" name="총매출" />
              <Line type="monotone" dataKey="card" stroke="#82ca9d" name="카드결제" />
              <Line type="monotone" dataKey="pos" stroke="#ffc658" name="현장결제(POS)" />
              <Line type="monotone" dataKey="transfer" stroke="#ff7300" name="계좌이체" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>연별 순매출</CardTitle>
          <CardDescription>막대 그래프 + 곡선형 라인 그래프</CardDescription>
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
