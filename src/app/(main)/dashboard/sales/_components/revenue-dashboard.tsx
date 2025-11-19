"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  ComposedChart,
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const dailyData = [
  { date: "1일", total: 4000, card: 3000, pos: 2000, transfer: 1000 },
  { date: "2일", total: 3000, card: 2500, pos: 1500, transfer: 800 },
  { date: "3일", total: 2000, card: 1800, pos: 1200, transfer: 600 },
  { date: "4일", total: 2780, card: 2000, pos: 1500, transfer: 700 },
  { date: "5일", total: 1890, card: 1500, pos: 1000, transfer: 500 },
];

const yearlyData = [
  { year: "2020", revenue: 400 },
  { year: "2021", revenue: 300 },
  { year: "2022", revenue: 200 },
  { year: "2023", revenue: 278 },
  { year: "2024", revenue: 189 },
];

export function RevenueDashboard() {
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
