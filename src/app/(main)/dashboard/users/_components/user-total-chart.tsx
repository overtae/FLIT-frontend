"use client";

import { useState, useEffect } from "react";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from "recharts";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getUserStatisticsTotal, getSecederStatisticsTotal } from "@/service/user.service";
import type { Period, UserType } from "@/types/user.type";

interface ChartDataPoint {
  date: string;
  current: number;
  last: number;
  lastDate: string;
}

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload as ChartDataPoint;

  return (
    <div className="bg-card rounded-lg border p-3 shadow-md">
      {payload.map((entry) => {
        const value = entry.value ?? 0;
        const label = entry.dataKey === "current" ? data.date : data.lastDate;
        return (
          <p key={entry.dataKey} className="text-sm" style={{ color: entry.color }}>
            {label}: {value.toLocaleString()}
          </p>
        );
      })}
    </div>
  );
};

interface UserTotalChartProps {
  category: string;
}

export function UserTotalChart({ category }: UserTotalChartProps) {
  const [period, setPeriod] = useState<"last-week" | "last-month" | "last-year">("last-month");
  const [customerType, setCustomerType] = useState<"all" | "individual" | "corporate">("all");
  const [totalUserData, setTotalUserData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTotalUserData = async () => {
      try {
        setIsLoading(true);

        const periodMap: Record<"last-week" | "last-month" | "last-year", Period> = {
          "last-week": "WEEK",
          "last-month": "MONTH",
          "last-year": "YEAR",
        };

        const typeMap: Record<"all" | "individual" | "corporate", "ALL" | UserType> = {
          all: "ALL",
          individual: "CUSTOMER_INDIVIDUAL",
          corporate: "CUSTOMER_OWNER",
        };

        const totalResponse =
          category === "seceder"
            ? await getSecederStatisticsTotal({
                period: periodMap[period],
              })
            : await getUserStatisticsTotal({
                period: periodMap[period],
                type: category === "customer" ? typeMap[customerType] : "ALL",
              });

        const chartData: ChartDataPoint[] = totalResponse.current.map((currentItem, index) => ({
          date: currentItem.date,
          current: currentItem.value,
          last: totalResponse.last[index]?.value ?? 0,
          lastDate: totalResponse.last[index]?.date ?? "",
        }));

        setTotalUserData(chartData);
      } catch (error) {
        console.error("Failed to fetch total user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTotalUserData();
  }, [category, period, customerType]);

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-row items-start justify-end space-y-0">
        <div className="flex items-center gap-4">
          {category === "customer" && (
            <RadioGroup
              value={customerType}
              onValueChange={(value) => setCustomerType(value as "all" | "individual" | "corporate")}
              className="flex items-center gap-2"
            >
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
          <Select
            value={period}
            onValueChange={(value) => setPeriod(value as "last-week" | "last-month" | "last-year")}
          >
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
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-muted-foreground text-sm">로딩 중...</div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={totalUserData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="current"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={{ r: 4, fill: "var(--primary)" }}
                activeDot={{ r: 6 }}
                name="current"
              />
              <Line
                type="monotone"
                dataKey="last"
                stroke="var(--muted-foreground)"
                strokeWidth={2}
                dot={{ r: 4, fill: "var(--muted-foreground)" }}
                activeDot={{ r: 6 }}
                name="last"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
