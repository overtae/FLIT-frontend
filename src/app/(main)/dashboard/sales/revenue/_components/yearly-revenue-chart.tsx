"use client";

import { useState } from "react";

import { ChevronRight } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
} from "recharts";

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

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value?: number;
    dataKey?: string;
  }>;
  label?: string;
}

function CustomBarTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length > 0) {
    return (
      <div className="bg-card border-border rounded-lg border p-2 shadow-lg">
        <p className="font-semibold">{label}</p>
        <p className="text-sm">{payload[0].value?.toLocaleString()}원</p>
      </div>
    );
  }
  return null;
}

function CustomLineTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length > 0) {
    return (
      <div className="bg-card border-border rounded-lg border p-2 shadow-lg">
        <p className="font-semibold">{label}</p>
        {payload.map((entry) => (
          <p
            key={entry.dataKey}
            className="text-sm"
            style={{ color: entry.dataKey === "2023" ? "var(--chart-1)" : undefined }}
          >
            {entry.dataKey}: {entry.value?.toLocaleString()}원
          </p>
        ))}
      </div>
    );
  }
  return null;
}

interface CustomLabelProps {
  x?: number;
  y?: number;
  value?: number;
  onClick?: () => void;
}

function CustomLabel({ x, y, value, onClick }: CustomLabelProps) {
  if (x === undefined || y === undefined || value === undefined) return null;

  return (
    <g>
      <foreignObject x={x - 100} y={y - 50} width="200" height="40">
        <div className="flex items-center justify-center">
          <button
            onClick={onClick}
            className="bg-primary text-primary-foreground cursor-pointer rounded-lg px-3 py-1 text-sm font-semibold shadow-lg transition-opacity hover:opacity-90"
          >
            {value.toLocaleString()}원
          </button>
        </div>
      </foreignObject>
    </g>
  );
}

export function YearlyRevenueChart() {
  const [selectedYear, setSelectedYear] = useState("2023");
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
            <Tooltip content={<CustomBarTooltip />} />
            <Bar
              dataKey="amount"
              radius={[4, 4, 0, 0]}
              label={{ position: "top", formatter: (value: number) => `${value.toLocaleString()}원` }}
            >
              {quarterlyData.map((entry) => (
                <Cell key={`cell-${entry.quarter}`} fill="var(--chart-2)" />
              ))}
            </Bar>
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
            <Tooltip content={<CustomLineTooltip />} />
            <Line type="monotone" dataKey="2020" stroke="var(--muted-foreground)" name="2020" strokeWidth={1} />
            <Line type="monotone" dataKey="2021" stroke="var(--muted-foreground)" name="2021" strokeWidth={1} />
            <Line type="monotone" dataKey="2022" stroke="var(--muted-foreground)" name="2022" strokeWidth={1} />
            <Line
              type="monotone"
              dataKey="2023"
              stroke="var(--chart-1)"
              strokeWidth={3}
              name="2023"
              dot={{ r: 6, fill: "var(--chart-1)", cursor: "pointer" }}
              activeDot={{
                r: 8,
                fill: "var(--chart-1)",
                cursor: "pointer",
                onClick: () => setIsYearlyModalOpen(true),
              }}
              label={(props: { x?: number; y?: number; value?: number }) => {
                const lastData = yearlyComparisonData[yearlyComparisonData.length - 1];
                if (props.value === lastData["2023"]) {
                  return (
                    <CustomLabel
                      x={props.x}
                      y={props.y}
                      value={props.value}
                      onClick={() => setIsYearlyModalOpen(true)}
                    />
                  );
                }
                return null;
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <YearlyDetailModal open={isYearlyModalOpen} onOpenChange={setIsYearlyModalOpen} year={selectedYear} />
    </div>
  );
}
