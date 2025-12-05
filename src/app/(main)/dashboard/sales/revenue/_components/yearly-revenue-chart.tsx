"use client";

import { useState } from "react";

import { ChevronRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { YearlyDetailModal } from "./yearly-detail-modal";

const quarterlyData = [
  { quarter: "1분기", amount: 700000000 },
  { quarter: "2분기", amount: 780000000 },
  { quarter: "3분기", amount: 850000000 },
  { quarter: "4분기", amount: 820000000 },
];

const yearlyComparisonData = [
  { month: "1월", "2020": 100000000, "2021": 120000000, "2022": 140000000, "2023": 160000000 },
  { month: "2월", "2020": 110000000, "2021": 130000000, "2022": 150000000, "2023": 170000000 },
  { month: "3월", "2020": 120000000, "2021": 140000000, "2022": 160000000, "2023": 180000000 },
  { month: "4월", "2020": 115000000, "2021": 135000000, "2022": 155000000, "2023": 175000000 },
  { month: "5월", "2020": 125000000, "2021": 145000000, "2022": 165000000, "2023": 185000000 },
  { month: "6월", "2020": 130000000, "2021": 150000000, "2022": 170000000, "2023": 190000000 },
];

export function YearlyRevenueChart() {
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedYearRange, setSelectedYearRange] = useState("2020-2023");
  const [isYearlyModalOpen, setIsYearlyModalOpen] = useState(false);

  return (
    <div className="grid grid-cols-5 gap-6">
      <div className="col-span-2">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{selectedYear} 분기별 총매출</span>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2020">2020</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsYearlyModalOpen(true)}>
            더보기 <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={quarterlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="quarter" />
            <YAxis />
            <Tooltip formatter={(value: number) => `${value.toLocaleString()}원`} />
            <Bar
              dataKey="amount"
              fill="hsl(var(--chart-2))"
              radius={[4, 4, 0, 0]}
              label={{ position: "top", formatter: (value: number) => `${value.toLocaleString()}원` }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="col-span-3">
        <div className="mb-4 flex items-center justify-between">
          <span className="font-semibold">연도별 추이</span>
          <Select value={selectedYearRange} onValueChange={setSelectedYearRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2020-2023">2020 ~ 2023</SelectItem>
              <SelectItem value="2021-2024">2021 ~ 2024</SelectItem>
              <SelectItem value="2022-2024">2022 ~ 2024</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={yearlyComparisonData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value: number) => `${value.toLocaleString()}원`} />
            <Line type="monotone" dataKey="2020" stroke="#8884d8" name="2020" />
            <Line type="monotone" dataKey="2021" stroke="#82ca9d" name="2021" />
            <Line type="monotone" dataKey="2022" stroke="#ffc658" name="2022" />
            <Line
              type="monotone"
              dataKey="2023"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              name="2023"
              dot={{ r: 5, fill: "hsl(var(--primary))" }}
              label={{ position: "right", value: "1,361,471,840", fill: "hsl(var(--primary))", fontSize: 12 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <YearlyDetailModal open={isYearlyModalOpen} onOpenChange={setIsYearlyModalOpen} year={selectedYear} />
    </div>
  );
}
