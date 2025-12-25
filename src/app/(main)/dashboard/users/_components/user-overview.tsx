"use client";

import { useState, useEffect } from "react";

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

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Subtitle } from "@/components/ui/subtitle";
import { getUserOverview } from "@/service/user.service";

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)"];

interface UserOverviewProps {
  category?: string;
}

export function UserOverview({ category = "all" }: UserOverviewProps) {
  const [period, setPeriod] = useState("last-month");
  const [customerType, setCustomerType] = useState("all");
  const [totalUserData, setTotalUserData] = useState<Array<{ date: string; count: number }>>([]);
  const [genderData, setGenderData] = useState<Array<{ name: string; value: number }>>([]);
  const [ageData, setAgeData] = useState<Array<{ name: string; value: number }>>([]);
  const [quickStats, setQuickStats] = useState({
    customer: { total: 0, change: 0, label: "전체 고객 수" },
    store: { total: 0, change: 0, label: "전체 꽃집 수" },
    florist: { total: 0, change: 0, label: "전체 플로리스트 수" },
    out: { total: 0, change: 0, label: "탈퇴 회원 수" },
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setIsLoading(true);
        const data = await getUserOverview({
          category,
          period,
          customerType,
        });
        setTotalUserData(data.totalUserData);
        setGenderData(data.genderData);
        setAgeData(data.ageData);
        setQuickStats(data.quickStats);
      } catch (error) {
        console.error("Failed to fetch user overview:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOverview();
  }, [category, period, customerType]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Top Section: Total User & Quick Stats */}
      <div className="grid space-y-6 space-x-8 md:grid-cols-2">
        {/* 1. Total User Chart */}
        <section className="flex flex-col gap-3">
          <div className="flex flex-row items-start justify-end space-y-0">
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
                <SelectTrigger>
                  <SelectValue placeholder="기간 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-week">Last Week</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="last-year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <h3 className="text-xl font-bold">Total User</h3>
          <div className="min-h-[250px] w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={totalUserData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "var(--chart-1)" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* 2. Quick Stats */}
        <section className="flex flex-col justify-center gap-3">
          <h3 className="text-xl font-bold">Quick Stats</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="flex flex-col justify-center rounded-lg p-4">
              <p className="text-muted-foreground text-3xl">{quickStats.customer.total.toLocaleString()}</p>
              <p className="text-muted-foreground mt-1 text-xs">+{quickStats.customer.change}</p>
              <p className="text-muted-foreground mt-1 text-xs">{quickStats.customer.label}</p>
              <p className="text-stroke-1 text-muted mt-2 text-lg font-bold tracking-wider">Customer</p>
            </div>
            <div className="flex flex-col justify-center rounded-lg p-4">
              <p className="text-muted-foreground text-3xl">{quickStats.store.total.toLocaleString()}</p>
              <p className="text-muted-foreground mt-1 text-xs">+{quickStats.store.change}</p>
              <p className="text-muted-foreground mt-1 text-xs">{quickStats.store.label}</p>
              <p className="text-stroke-1 text-muted mt-2 text-lg font-bold tracking-wider">Store</p>
            </div>
            <div className="flex flex-col justify-center rounded-lg p-4">
              <p className="text-muted-foreground text-3xl">{quickStats.florist.total.toLocaleString()}</p>
              <p className="text-muted-foreground mt-1 text-xs">+{quickStats.florist.change}</p>
              <p className="text-muted-foreground mt-1 text-xs">{quickStats.florist.label}</p>
              <p className="text-stroke-1 text-muted mt-2 text-lg font-bold tracking-wider">Florist</p>
            </div>
            <div className="flex flex-col justify-center rounded-lg p-4">
              <p className="text-muted-foreground text-3xl">{quickStats.out.total.toLocaleString()}</p>
              <p className="text-muted-foreground mt-1 text-xs">+{quickStats.out.change}</p>
              <p className="text-muted-foreground mt-1 text-xs">{quickStats.out.label}</p>
              <p className="text-stroke-1 text-muted mt-2 text-lg font-bold tracking-wider">Out</p>
            </div>
          </div>
        </section>
      </div>

      {/* Bottom Section: Gender & Age Group */}
      <section className="flex h-80 flex-col gap-6">
        <Subtitle>Gender & Age Group</Subtitle>
        <div className="flex h-full flex-1 gap-8">
          {/* Gender Donut Chart */}
          <div className="flex h-full w-fit shrink-0 flex-col items-center justify-center">
            <div className="h-full w-[300px] flex-1">
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
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.5rem",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-4">
              {genderData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="h-3 w-3" style={{ backgroundColor: COLORS[index] ?? COLORS[0] }} />
                  <span className="text-sm font-medium">{entry.name}</span>
                  <span className="text-muted-foreground text-sm">{entry.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Age Bar Chart */}
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                />
                <Bar
                  dataKey="value"
                  fill="var(--chart-1)"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                  label={{ position: "top", fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                >
                  {ageData.map((entry, index) => (
                    <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
}
