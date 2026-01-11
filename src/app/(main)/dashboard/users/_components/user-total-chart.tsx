"use client";

import { useState, useEffect } from "react";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from "recharts";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatNumberShort } from "@/lib/chart-utils";
import { formatDate } from "@/lib/format-date";
import { getUserStatisticsTotal, getSecederStatisticsTotal } from "@/service/user.service";
import type { Period, UserType } from "@/types/user.type";

interface ChartDataPoint {
  date: string;
  current: number;
  last: number;
  lastDate: string;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  period: "last-week" | "last-month" | "last-year";
}

const CustomTooltip = ({ active, payload, coordinate, period }: CustomTooltipProps) => {
  if (!active || !payload || payload.length === 0 || !coordinate) return null;

  const data = payload[0].payload as ChartDataPoint;
  const currentEntry = payload.find((entry) => entry.dataKey === "current");

  if (!currentEntry) return null;

  const getDateFormat = () => {
    if (period === "last-week") {
      return "MMM dd";
    } else if (period === "last-month") {
      return "yyyy MMM";
    } else {
      return "yyyy";
    }
  };

  const dateFormat = getDateFormat();

  return (
    <div className="bg-primary relative w-24 rounded-lg border p-2 sm:w-28 sm:p-3">
      <div className="bg-primary absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45" />
      {payload.map((entry) => {
        const value = entry.value ?? 0;
        const label = entry.dataKey === "current" ? data.date : data.lastDate;
        return (
          <p key={entry.dataKey} className="text-primary-foreground text-xs sm:text-sm">
            {formatDate(label, dateFormat)}: {formatNumberShort(value)}
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
    <section className="flex flex-col gap-2 sm:gap-3">
      <div className="flex flex-col items-start justify-end gap-2 space-y-0 sm:flex-row sm:items-start">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          {category === "customer" && (
            <RadioGroup
              value={customerType}
              onValueChange={(value) => setCustomerType(value as "all" | "individual" | "corporate")}
              className="flex items-center gap-1.5 sm:gap-2"
            >
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <RadioGroupItem value="all" id="r-all" className="h-4 w-4 sm:h-5 sm:w-5" />
                <Label htmlFor="r-all" className="text-xs sm:text-sm">
                  All
                </Label>
              </div>
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <RadioGroupItem value="individual" id="r-ind" className="h-4 w-4 sm:h-5 sm:w-5" />
                <Label htmlFor="r-ind" className="text-xs sm:text-sm">
                  개인
                </Label>
              </div>
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <RadioGroupItem value="corporate" id="r-corp" className="h-4 w-4 sm:h-5 sm:w-5" />
                <Label htmlFor="r-corp" className="text-xs sm:text-sm">
                  기업
                </Label>
              </div>
            </RadioGroup>
          )}
          <Select
            value={period}
            onValueChange={(value) => setPeriod(value as "last-week" | "last-month" | "last-year")}
          >
            <SelectTrigger className="h-8 w-[120px] text-xs sm:h-10 sm:w-[140px] sm:text-sm">
              <SelectValue placeholder="기간 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-week" className="text-xs sm:text-sm">
                Last Week
              </SelectItem>
              <SelectItem value="last-month" className="text-xs sm:text-sm">
                Last Month
              </SelectItem>
              <SelectItem value="last-year" className="text-xs sm:text-sm">
                Last Year
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <h3 className="text-base font-bold sm:text-lg md:text-xl">Total User</h3>
      <div className="h-[200px] w-full grow items-center justify-center sm:h-auto sm:min-h-[250px]">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-muted-foreground text-sm">로딩 중...</div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={totalUserData} margin={{ top: 30, right: 5, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10 }}
                dy={5}
                className="sm:dy-[10px] sm:text-[12px]"
                tickFormatter={(value) => {
                  if (period === "last-week") {
                    return formatDate(value, "MMM dd");
                  } else if (period === "last-month") {
                    return formatDate(value, "MMM");
                  } else {
                    return formatDate(value, "yyyy");
                  }
                }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10 }}
                tickFormatter={formatNumberShort}
                className="sm:text-[12px]"
              />
              <Tooltip
                content={<CustomTooltip period={period} />}
                cursor={{ stroke: "var(--primary)", strokeWidth: 1 }}
                allowEscapeViewBox={{ x: true, y: true }}
                offset={-57}
                position={{ y: -70 }}
              />
              <Line
                type="monotone"
                dataKey="current"
                stroke="var(--primary)"
                strokeWidth={1.5}
                dot={false}
                activeDot={{ r: 5, fill: "var(--primary)" }}
                name="current"
                className="sm:activeDot:r-[6px] sm:stroke-[2px]"
              />
              {period !== "last-year" && (
                <Line
                  type="monotone"
                  dataKey="last"
                  stroke="var(--muted-foreground)"
                  strokeWidth={1.5}
                  dot={false}
                  activeDot={false}
                  name="last"
                  className="sm:stroke-[2px]"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
