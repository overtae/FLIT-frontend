"use client";

import { useEffect, useState } from "react";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

import { DEFAULT_CHART_MARGIN, formatNumberShort } from "@/lib/chart-utils";
import { getProductCategory } from "@/service/sales.service";
import type { ProductCategoryResponse } from "@/types/sales.type";

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

export function CategorySalesChart({ viewMode, selectedDate, onCategoryClick }: CategorySalesChartProps) {
  const [data, setData] = useState<ProductCategoryResponse[]>([]);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const targetDate = selectedDate
          ? selectedDate.toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0];
        const chartData = await getProductCategory({
          targetDate,
          category: viewMode === "group" ? "GROUP" : "PRODUCT",
        });
        setData(chartData);
      } catch (error) {
        console.error("Failed to fetch category chart data:", error);
      }
    };

    fetchChartData();
  }, [viewMode, selectedDate]);

  const handleBarClick = (data: { label: string }) => {
    onCategoryClick(data.label);
  };

  return (
    <ResponsiveContainer width="100%" height={300} className="sm:h-[400px]">
      <BarChart data={data} margin={{ ...DEFAULT_CHART_MARGIN, top: 10, right: 5, left: 5, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="label"
          angle={-45}
          textAnchor="end"
          height={80}
          tick={{ fontSize: 10 }}
          className="sm:h-[100px] sm:text-xs"
        />
        <YAxis
          tickFormatter={formatNumberShort}
          width={50}
          tick={{ fontSize: 10 }}
          className="sm:w-[60px] sm:text-xs"
        />
        <Tooltip
          formatter={(value: number) => `${formatNumberShort(value)}원`}
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "0.5rem",
            fontSize: "12px",
          }}
        />
        <Bar dataKey="value" onClick={handleBarClick} cursor="pointer">
          {data.map((entry, index) => (
            <Cell key={`cell-${entry.label}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
