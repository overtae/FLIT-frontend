"use client";

import { useEffect, useState } from "react";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

import { getCategoryChartData } from "@/service/chart.service";
import { CategoryChartData } from "@/types/dashboard";

interface CategorySalesChartProps {
  viewMode: "group" | "product";
  selectedDate?: Date;
  onCategoryClick: (category: string | null) => void;
}

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-1)",
  "var(--chart-2)",
];

export function CategorySalesChart({ viewMode, onCategoryClick }: CategorySalesChartProps) {
  const [data, setData] = useState<CategoryChartData[]>([]);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const chartData = await getCategoryChartData(viewMode);
        setData(chartData);
      } catch (error) {
        console.error("Failed to fetch category chart data:", error);
      }
    };

    fetchChartData();
  }, [viewMode]);

  const handleBarClick = (data: { name: string }) => {
    onCategoryClick(data.name);
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
        <YAxis />
        <Tooltip
          formatter={(value: number) => `${value.toLocaleString()}원`}
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "0.5rem",
          }}
        />
        <Bar dataKey="revenue" onClick={handleBarClick} cursor="pointer">
          {data.map((entry, index) => (
            <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
