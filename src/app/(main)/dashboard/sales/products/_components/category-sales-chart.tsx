"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface CategorySalesChartProps {
  viewMode: "group" | "product";
  selectedDate?: Date;
  onCategoryClick: (category: string | null) => void;
}

const groupData = [
  { name: "꽃", revenue: 5000000 },
  { name: "식물", revenue: 3500000 },
  { name: "화환", revenue: 2800000 },
  { name: "공간연출", revenue: 2200000 },
  { name: "정기배송", revenue: 1800000 },
];

const productData = [
  { name: "꽃다발", revenue: 2500000 },
  { name: "꽃바구니", revenue: 1800000 },
  { name: "동양난", revenue: 1200000 },
  { name: "서양난", revenue: 1000000 },
  { name: "다육식물", revenue: 800000 },
  { name: "화분", revenue: 700000 },
  { name: "공기정화", revenue: 600000 },
  { name: "축하화환", revenue: 1500000 },
  { name: "근조화환", revenue: 1300000 },
  { name: "플랜테리어", revenue: 1100000 },
  { name: "가드닝", revenue: 900000 },
  { name: "정기배송", revenue: 1800000 },
];

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#00ff00",
  "#0088fe",
  "#ff00ff",
  "#ff0000",
  "#00ffff",
  "#ffff00",
  "#ffa500",
  "#800080",
];

export function CategorySalesChart({
  viewMode,
  selectedDate: _selectedDate,
  onCategoryClick,
}: CategorySalesChartProps) {
  const data = viewMode === "group" ? groupData : productData;

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
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            border: "1px solid #ccc",
            borderRadius: "4px",
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
