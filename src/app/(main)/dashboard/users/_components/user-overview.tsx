"use client";

import { useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { UserList } from "./user-list";

// --- Dummy Data ---

const totalUserData = [
  { date: "10-01", count: 2000 },
  { date: "10-05", count: 2500 },
  { date: "10-10", count: 3200 },
  { date: "10-15", count: 3000 },
  { date: "10-20", count: 4000 },
  { date: "10-25", count: 4800 },
  { date: "10-30", count: 5200 },
];

const genderData = [
  { name: "여성", value: 60 },
  { name: "남성", value: 35 },
  { name: "기타", value: 5 },
];

const ageData = [
  { name: "10대", value: 120 },
  { name: "20대", value: 450 },
  { name: "30대", value: 380 },
  { name: "40대", value: 220 },
  { name: "50대", value: 150 },
  { name: "60대", value: 80 },
  { name: "70대+", value: 40 },
];

const COLORS = ["#F472B6", "#60A5FA", "#9CA3AF"];

interface UserOverviewProps {
  category?: string;
}

export function UserOverview({ category = "all" }: UserOverviewProps) {
  const [period, setPeriod] = useState("last-month");
  const [customerType, setCustomerType] = useState("all");

  const isAllCategory = category === "all";

  return (
    <div className="space-y-6">
      {/* Top Section: Total User & Quick Stats */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* 1. Total User Chart */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Total User</CardTitle>
            </div>
            <div className="flex items-center gap-4">
              {category === "customer" && (
                <RadioGroup value={customerType} onValueChange={setCustomerType} className="flex items-center gap-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="r-all" />
                    <Label htmlFor="r-all">All</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="individual" id="r-ind" />
                    <Label htmlFor="r-ind">개인</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="corporate" id="r-corp" />
                    <Label htmlFor="r-corp">기업</Label>
                  </div>
                </RadioGroup>
              )}
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="기간 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-week">Last Week</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="last-year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="flex-1 pb-4">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={totalUserData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#EF4444"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#EF4444" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 2. Quick Stats */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="grid flex-1 grid-cols-4 gap-4">
            <div className="flex flex-col justify-center rounded-lg p-4">
              <p className="text-muted-foreground text-3xl">67,790</p>
              <p className="text-muted-foreground mt-1 text-sm">+145</p>
              <p className="text-muted-foreground mt-1 text-sm">전체 고객 수</p>
              <p className="text-stroke-1 text-muted mt-2 text-lg font-bold tracking-wider">Customer</p>
            </div>
            <div className="flex flex-col justify-center rounded-lg p-4">
              <p className="text-muted-foreground text-3xl">4,500</p>
              <p className="text-muted-foreground mt-1 text-sm">+14</p>
              <p className="text-muted-foreground mt-1 text-sm">전체 꽃집 수</p>
              <p className="text-stroke-1 text-muted mt-2 text-lg font-bold tracking-wider">Store</p>
            </div>
            <div className="flex flex-col justify-center rounded-lg p-4">
              <p className="text-muted-foreground text-3xl">4,300</p>
              <p className="text-muted-foreground mt-1 text-sm">+13</p>
              <p className="text-muted-foreground mt-1 text-sm">전체 플로리스트 수</p>
              <p className="text-stroke-1 text-muted mt-2 text-lg font-bold tracking-wider">Florist</p>
            </div>
            <div className="flex flex-col justify-center rounded-lg p-4">
              <p className="text-muted-foreground text-3xl">34</p>
              <p className="text-muted-foreground mt-1 text-sm">+13</p>
              <p className="text-muted-foreground mt-1 text-sm">탈퇴 회원 수</p>
              <p className="text-stroke-1 text-muted mt-2 text-lg font-bold tracking-wider">Out</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section: Gender & Age Group */}
      <Card>
        <CardHeader>
          <CardTitle>Gender & Age Group</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-8 md:grid-cols-2">
            {/* Gender Donut Chart */}
            <div className="flex flex-col items-center justify-center">
              <div className="h-[250px] w-full max-w-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genderData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {genderData.map((entry, index) => (
                        <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex gap-4">
                {genderData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                    <span className="text-sm font-medium">{entry.name}</span>
                    <span className="text-muted-foreground text-sm">{entry.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Age Bar Chart */}
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <Tooltip cursor={{ fill: "transparent" }} />
                  <Bar
                    dataKey="value"
                    fill="#8884d8"
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                    label={{ position: "top", fill: "#6B7280", fontSize: 12 }}
                  >
                    {ageData.map((entry) => (
                      <Cell key={`cell-${entry.name}`} fill="#93C5FD" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
