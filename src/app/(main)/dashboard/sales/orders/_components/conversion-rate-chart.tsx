"use client";

import { RadialBarChart, RadialBar, ResponsiveContainer, Cell } from "recharts";

interface ConversionRateChartProps {
  period: "weekly" | "monthly" | "yearly";
}

const conversionData = {
  weekly: {
    current: 3.5,
    last: 3.2,
    percentage: 9.4,
  },
  monthly: {
    current: 3.8,
    last: 3.5,
    percentage: 8.6,
  },
  yearly: {
    current: 4.2,
    last: 3.9,
    percentage: 7.7,
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
    {
      name: "conversion",
      value: data.current,
      fill: "#8884d8",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative h-64 w-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="90%"
            barSize={10}
            data={chartData}
            startAngle={90}
            endAngle={-270}
          >
            <RadialBar background dataKey="value" cornerRadius={10} fill="#8884d8">
              <Cell fill="#8884d8" />
            </RadialBar>
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-bold">{data.current}%</div>
          <div className="text-muted-foreground text-xs">{periodLabel}</div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center gap-6">
        <div className="text-center">
          <div className="text-muted-foreground text-sm">Last {periodLabel}</div>
          <div className="text-lg font-semibold">{data.last}%</div>
        </div>
        <div className="text-center">
          <div className="text-muted-foreground text-sm">This {periodLabel}</div>
          <div className="text-lg font-semibold">{data.current}%</div>
        </div>
      </div>

      <div className="text-center">
        <div className="text-sm font-medium">Conversion Rate</div>
      </div>
    </div>
  );
}
