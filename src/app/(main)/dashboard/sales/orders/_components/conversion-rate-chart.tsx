"use client";

import { useState, useEffect } from "react";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

import { getOrderConversionRate } from "@/service/sales.service";
import type { OrderPeriod } from "@/types/sales.type";

interface ConversionRateChartProps {
  period: "weekly" | "monthly" | "yearly";
  className?: string;
}

const periodLabels = {
  weekly: "week",
  monthly: "month",
  yearly: "year",
};

const periodMap: Record<"weekly" | "monthly" | "yearly", OrderPeriod> = {
  weekly: "WEEKLY",
  monthly: "MONTHLY",
  yearly: "YEARLY",
};

export function ConversionRateChart({ period, className }: ConversionRateChartProps) {
  const [data, setData] = useState<{ current: number; last: number }>({ current: 0, last: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const periodLabel = periodLabels[period];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await getOrderConversionRate({ period: periodMap[period] });
        setData({ current: response.current, last: response.last });
      } catch (error) {
        console.error("Failed to fetch conversion rate:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [period]);

  const chartData = [
    { name: "filled", value: data.current },
    { name: "empty", value: 100 - data.current },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4">
      <div className={className ?? "relative h-48 w-48 sm:h-64 sm:w-64"}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="90%"
              startAngle={90}
              endAngle={-270}
              dataKey="value"
            >
              <Cell fill="var(--chart-1)" />
              <Cell fill="var(--chart-2)" fillOpacity={0.3} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-2xl font-bold sm:text-4xl">{data.current}%</div>
          <div className="text-muted-foreground text-xs">{periodLabel}</div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center gap-4 sm:gap-6">
        <div className="text-center">
          <div className="text-muted-foreground text-xs sm:text-sm">Last {periodLabel}</div>
          <div className="text-base font-bold sm:text-lg">{data.last}%</div>
        </div>
        <div className="text-center">
          <div className="text-muted-foreground text-xs sm:text-sm">This {periodLabel}</div>
          <div className="text-base font-bold sm:text-lg">{data.current}%</div>
        </div>
      </div>
    </div>
  );
}
