"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface ConversionRateChartProps {
  period: "weekly" | "monthly" | "yearly";
}

const conversionData = {
  weekly: {
    current: 75,
    last: 72,
  },
  monthly: {
    current: 78,
    last: 75,
  },
  yearly: {
    current: 82,
    last: 79,
  },
};

const periodLabels = {
  weekly: "week",
  monthly: "month",
  yearly: "year",
};

export function ConversionRateChart({ period }: ConversionRateChartProps) {
  const data = conversionData[period];
  const periodLabel = periodLabels[period];

  const chartData = [
    { name: "filled", value: data.current },
    { name: "empty", value: 100 - data.current },
  ];

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative h-64 w-64">
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
          <div className="text-4xl font-bold">{data.current}%</div>
          <div className="text-muted-foreground text-xs">{periodLabel}</div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center gap-6">
        <div className="text-center">
          <div className="text-muted-foreground text-sm">Last {periodLabel}</div>
          <div className="text-lg font-bold">{data.last}%</div>
        </div>
        <div className="text-center">
          <div className="text-muted-foreground text-sm">This {periodLabel}</div>
          <div className="text-lg font-bold">{data.current}%</div>
        </div>
      </div>
    </div>
  );
}
