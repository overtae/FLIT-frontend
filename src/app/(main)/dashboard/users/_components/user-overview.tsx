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
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const revenueData = [
  { date: "1월", revenue: 4000 },
  { date: "2월", revenue: 3000 },
  { date: "3월", revenue: 2000 },
  { date: "4월", revenue: 2780 },
  { date: "5월", revenue: 1890 },
  { date: "6월", revenue: 2390 },
];

const categoryData = [
  { name: "고객", value: 400 },
  { name: "매장", value: 300 },
  { name: "플로리스트", value: 200 },
  { name: "탈퇴", value: 100 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const barData = [
  { name: "1월", value: 400 },
  { name: "2월", value: 300 },
  { name: "3월", value: 200 },
  { name: "4월", value: 278 },
  { name: "5월", value: 189 },
  { name: "6월", value: 239 },
];

export function UserOverview() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>기간별 통계</CardTitle>
          <CardDescription>꺾은선 그래프 + 기간 필터</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>카테고리별 분포</CardTitle>
          <CardDescription>도넛 그래프</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>통계 요약</CardTitle>
          <CardDescription>요약 카드</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border p-4">
              <p className="text-muted-foreground text-sm">총 유저 수</p>
              <p className="text-2xl font-bold">1,234</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-muted-foreground text-sm">신규 가입</p>
              <p className="text-2xl font-bold">56</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-muted-foreground text-sm">활성 유저</p>
              <p className="text-2xl font-bold">890</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-muted-foreground text-sm">탈퇴 유저</p>
              <p className="text-2xl font-bold">100</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>월별 가입 현황</CardTitle>
          <CardDescription>막대 그래프</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
