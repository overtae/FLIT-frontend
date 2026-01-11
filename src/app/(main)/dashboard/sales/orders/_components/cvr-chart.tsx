"use client";

import { useState, useEffect, useMemo } from "react";

import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subWeeks,
  subMonths,
  subYears,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
} from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

import { formatNumberShort } from "@/lib/chart-utils";
import { getOrderCvr } from "@/service/sales.service";
import type { OrderPeriod } from "@/types/sales.type";

interface CvrChartProps {
  period: "weekly" | "monthly" | "yearly";
  selectedDate?: Date;
}

const periodMap: Record<"weekly" | "monthly" | "yearly", OrderPeriod> = {
  weekly: "WEEKLY",
  monthly: "MONTHLY",
  yearly: "YEARLY",
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value?: string | number | Array<string | number>;
    name?: string;
    color?: string;
    payload?: Record<string, unknown>;
  }>;
}

const PERIOD_LABELS = {
  weekly: "Week",
  monthly: "Month",
  yearly: "Year",
} as const;

const THIS_PERIOD_KEYS = ["thisWeek", "thisMonth", "thisYear"] as const;

function getPeriodLabel(entryName: string, period: "weekly" | "monthly" | "yearly"): string {
  const isThisPeriod = THIS_PERIOD_KEYS.includes(entryName as (typeof THIS_PERIOD_KEYS)[number]);
  const periodLabel = PERIOD_LABELS[period];
  return isThisPeriod ? `This ${periodLabel}` : `Last ${periodLabel}`;
}

function CustomTooltip({
  active,
  payload,
  xAxisKey,
  period,
}: CustomTooltipProps & { xAxisKey: string; period: "weekly" | "monthly" | "yearly" }) {
  if (active && payload && payload.length > 0) {
    const firstPayload = payload[0];
    const payloadData = firstPayload.payload;
    const xAxisValue = payloadData?.[xAxisKey];

    return (
      <div className="bg-primary text-primary-foreground rounded-lg p-3 shadow-lg">
        <p className="mb-2 font-semibold">{String(xAxisValue)}</p>
        {payload.map((pld) => {
          const entryName = String(pld.name ?? "");
          const entryValue = Array.isArray(pld.value) ? pld.value[0] : typeof pld.value === "number" ? pld.value : 0;
          const periodLabel = getPeriodLabel(entryName, period);

          return (
            <p key={entryName || String(entryValue)} className="text-sm">
              {periodLabel}: {entryValue}%
            </p>
          );
        })}
      </div>
    );
  }
  return null;
}

export function CvrChart({ period, selectedDate }: CvrChartProps) {
  const [data, setData] = useState<Array<Record<string, string | number>>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!selectedDate) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        let startDate: Date;
        let endDate: Date;

        switch (period) {
          case "weekly": {
            endDate = endOfWeek(selectedDate);
            startDate = startOfWeek(selectedDate);
            break;
          }
          case "monthly": {
            endDate = endOfMonth(selectedDate);
            startDate = startOfMonth(selectedDate);
            break;
          }
          case "yearly": {
            endDate = endOfYear(selectedDate);
            startDate = startOfYear(selectedDate);
            break;
          }
        }

        const response = await getOrderCvr({
          period: periodMap[period],
          startDate: format(startDate, "yyyy-MM-dd"),
          endDate: format(endDate, "yyyy-MM-dd"),
        });

        let chartData: Array<Record<string, string | number>> = [];

        switch (period) {
          case "weekly": {
            const days = eachDayOfInterval({ start: startDate, end: endDate });
            const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            chartData = days.map((day, index) => ({
              day: dayLabels[day.getDay()],
              thisWeek: response[index]?.current ?? 0,
              lastWeek: response[index]?.last ?? 0,
            }));
            break;
          }
          case "monthly": {
            const weeks = eachWeekOfInterval({ start: startDate, end: endDate });
            chartData = weeks.map((week, index) => ({
              week: `${index + 1}주`,
              thisMonth: response[index]?.current ?? 0,
              lastMonth: response[index]?.last ?? 0,
            }));
            break;
          }
          case "yearly": {
            const months = eachMonthOfInterval({ start: startDate, end: endDate });
            chartData = months.map((month, index) => ({
              month: `${month.getMonth() + 1}월`,
              thisYear: response[index]?.current ?? 0,
              lastYear: response[index]?.last ?? 0,
            }));
            break;
          }
        }

        setData(chartData);
      } catch (error) {
        console.error("Failed to fetch CVR data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [period, selectedDate]);

  const getXAxisKey = () => {
    switch (period) {
      case "weekly":
        return "day";
      case "monthly":
        return "week";
      case "yearly":
        return "month";
      default:
        return "day";
    }
  };

  const xAxisKey = getXAxisKey();

  const tooltipContent = useMemo(() => <CustomTooltip xAxisKey={xAxisKey} period={period} />, [xAxisKey, period]);

  if (isLoading || !selectedDate) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} />
        <YAxis tickFormatter={(value) => `${value}%`} />
        <Tooltip content={tooltipContent} />
        <Legend />
        <Line
          type="monotone"
          dataKey={period === "weekly" ? "thisWeek" : period === "monthly" ? "thisMonth" : "thisYear"}
          stroke="var(--chart-1)"
          name={period === "weekly" ? "This Week" : period === "monthly" ? "This Month" : "This Year"}
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey={period === "weekly" ? "lastWeek" : period === "monthly" ? "lastMonth" : "lastYear"}
          stroke="var(--muted-foreground)"
          strokeDasharray="5 5"
          name={period === "weekly" ? "Last Week" : period === "monthly" ? "Last Month" : "Last Year"}
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
