"use client";

import { useMemo } from "react";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface CvrChartProps {
  period: "weekly" | "monthly" | "yearly";
  selectedDate?: Date;
}

const weeklyData = [
  { day: "Sun", thisWeek: 3.2, lastWeek: 2.8 },
  { day: "Mon", thisWeek: 3.5, lastWeek: 3.1 },
  { day: "Tue", thisWeek: 3.8, lastWeek: 3.3 },
  { day: "Wed", thisWeek: 3.6, lastWeek: 3.2 },
  { day: "Thu", thisWeek: 3.9, lastWeek: 3.5 },
  { day: "Fri", thisWeek: 4.1, lastWeek: 3.7 },
  { day: "Sat", thisWeek: 3.7, lastWeek: 3.4 },
];

const monthlyData = [
  { week: "1주", thisMonth: 3.5, lastMonth: 3.2 },
  { week: "2주", thisMonth: 3.8, lastMonth: 3.4 },
  { week: "3주", thisMonth: 3.9, lastMonth: 3.6 },
  { week: "4주", thisMonth: 4.1, lastMonth: 3.8 },
];

const yearlyData = [
  { month: "1월", thisYear: 3.2, lastYear: 2.9 },
  { month: "2월", thisYear: 3.5, lastYear: 3.1 },
  { month: "3월", thisYear: 3.8, lastYear: 3.4 },
  { month: "4월", thisYear: 3.9, lastYear: 3.6 },
  { month: "5월", thisYear: 4.1, lastYear: 3.8 },
  { month: "6월", thisYear: 4.2, lastYear: 3.9 },
];

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
      <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
        <p className="mb-2 font-semibold">{String(xAxisValue)}</p>
        {payload.map((pld) => {
          const entryName = String(pld.name ?? "");
          const entryValue = Array.isArray(pld.value) ? pld.value[0] : typeof pld.value === "number" ? pld.value : 0;
          const entryColor = pld.color;
          const periodLabel = getPeriodLabel(entryName, period);

          return (
            <p key={entryName || String(entryValue)} className="text-sm" style={{ color: entryColor }}>
              {periodLabel}: {entryValue}%
            </p>
          );
        })}
      </div>
    );
  }
  return null;
}

export function CvrChart({ period, selectedDate: _selectedDate }: CvrChartProps) {
  const getData = () => {
    switch (period) {
      case "weekly":
        return weeklyData;
      case "monthly":
        return monthlyData;
      case "yearly":
        return yearlyData;
      default:
        return weeklyData;
    }
  };

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

  const data = getData();
  const xAxisKey = getXAxisKey();

  const tooltipContent = useMemo(() => <CustomTooltip xAxisKey={xAxisKey} period={period} />, [xAxisKey, period]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        <Tooltip content={tooltipContent} />
        <Legend />
        <Line
          type="monotone"
          dataKey={period === "weekly" ? "thisWeek" : period === "monthly" ? "thisMonth" : "thisYear"}
          stroke="#8884d8"
          name={period === "weekly" ? "This Week" : period === "monthly" ? "This Month" : "This Year"}
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey={period === "weekly" ? "lastWeek" : period === "monthly" ? "lastMonth" : "lastYear"}
          stroke="#82ca9d"
          name={period === "weekly" ? "Last Week" : period === "monthly" ? "Last Month" : "Last Year"}
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
