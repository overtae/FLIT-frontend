"use client";

import { useState, useEffect } from "react";

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
import { DEFAULT_CHART_MARGIN, formatNumberShort } from "@/lib/chart-utils";
import { getRevenueNetYearly, getRevenueNetQuarter } from "@/service/sales.service";

import { YearlyDetailModal } from "./yearly-detail-modal";

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
    const value = payload[0].value ?? 0;
    return (
      <div className="bg-card border-border rounded-lg border p-2 shadow-lg">
        <p className="font-semibold">{label}</p>
        <p className="text-sm">{formatNumberShort(typeof value === "number" ? value : 0)}원</p>
      </div>
    );
  }
  return null;
}

function CustomLineTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length > 0) {
    const value = payload[0].value ?? 0;
    return (
      <div className="bg-card border-border rounded-lg border p-2 shadow-lg">
        <p className="font-semibold">{label}년</p>
        <p className="text-sm">{formatNumberShort(typeof value === "number" ? value : 0)}원</p>
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
            {formatNumberShort(value)}원
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
  const [quarterlyData, setQuarterlyData] = useState<Array<{ quarter: string; amount: number }>>([]);
  const [yearlyComparisonData, setYearlyComparisonData] = useState<Array<{ year: string; value: number }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const [startYear, endYear] = selectedYearRange.split("-");
        const yearlyData = await getRevenueNetYearly({
          startYear,
          endYear,
        });

        const quarterlyData = await getRevenueNetQuarter({
          targetYear: selectedYear,
        });

        const quarterlyDataList = [
          { quarter: "Q1", amount: quarterlyData.q1 },
          { quarter: "Q2", amount: quarterlyData.q2 },
          { quarter: "Q3", amount: quarterlyData.q3 },
          { quarter: "Q4", amount: quarterlyData.q4 },
        ];
        setQuarterlyData(quarterlyDataList);

        setYearlyComparisonData(yearlyData);
      } catch (error) {
        console.error("Failed to fetch yearly revenue chart data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedYear, selectedYearRange]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-5 sm:gap-6">
      <div className="col-span-1 sm:col-span-2">
        <div className="mb-3 flex flex-col gap-2 sm:mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-semibold sm:text-base">{selectedYear} 분기별 총매출</span>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[90px] text-xs sm:w-[100px] sm:text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2020" className="text-xs sm:text-sm">
                  2020
                </SelectItem>
                <SelectItem value="2021" className="text-xs sm:text-sm">
                  2021
                </SelectItem>
                <SelectItem value="2022" className="text-xs sm:text-sm">
                  2022
                </SelectItem>
                <SelectItem value="2023" className="text-xs sm:text-sm">
                  2023
                </SelectItem>
                <SelectItem value="2024" className="text-xs sm:text-sm">
                  2024
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="self-end text-xs sm:text-sm"
            onClick={() => setIsYearlyModalOpen(true)}
          >
            더보기 <ChevronRight className="ml-1 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
        </div>
        <ResponsiveContainer width="100%" height={300} className="sm:h-[400px]">
          <BarChart data={quarterlyData} margin={{ ...DEFAULT_CHART_MARGIN, top: 10, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="quarter" tick={{ fontSize: 10 }} className="sm:text-xs" />
            <YAxis
              tickFormatter={formatNumberShort}
              width={50}
              tick={{ fontSize: 10 }}
              className="sm:w-[60px] sm:text-xs"
            />
            <Tooltip content={<CustomBarTooltip />} contentStyle={{ fontSize: "12px" }} />
            <Bar
              dataKey="amount"
              radius={[4, 4, 0, 0]}
              label={{
                position: "top",
                formatter: (value: number) => `${formatNumberShort(value)}원`,
                style: { fontSize: "10px" },
              }}
            >
              {quarterlyData.map((entry) => (
                <Cell key={`cell-${entry.quarter}`} fill="var(--chart-2)" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="col-span-1 sm:col-span-3">
        <div className="mb-3 flex flex-col gap-2 sm:mb-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm font-semibold sm:text-base">연도별 추이</span>
          <Select value={selectedYearRange} onValueChange={setSelectedYearRange}>
            <SelectTrigger className="w-full text-xs sm:w-[150px] sm:text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2020-2023" className="text-xs sm:text-sm">
                2020 ~ 2023
              </SelectItem>
              <SelectItem value="2021-2024" className="text-xs sm:text-sm">
                2021 ~ 2024
              </SelectItem>
              <SelectItem value="2022-2024" className="text-xs sm:text-sm">
                2022 ~ 2024
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <ResponsiveContainer width="100%" height={300} className="sm:h-[400px]">
          <LineChart
            data={yearlyComparisonData}
            margin={{ ...DEFAULT_CHART_MARGIN, top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" tick={{ fontSize: 10 }} className="sm:text-xs" />
            <YAxis
              tickFormatter={formatNumberShort}
              width={50}
              tick={{ fontSize: 10 }}
              className="sm:w-[60px] sm:text-xs"
            />
            <Tooltip content={<CustomLineTooltip />} contentStyle={{ fontSize: "12px" }} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--chart-1)"
              strokeWidth={2}
              dot={{ r: 4, fill: "var(--chart-1)", cursor: "pointer" }}
              activeDot={{
                r: 6,
                fill: "var(--chart-1)",
                cursor: "pointer",
                onClick: () => setIsYearlyModalOpen(true),
              }}
              className="sm:dot:r-[6px] sm:activeDot:r-[8px] sm:stroke-[3px]"
              label={(props: { x?: number; y?: number; value?: number; payload?: { year: string; value: number } }) => {
                const lastData = yearlyComparisonData[yearlyComparisonData.length - 1];
                if (props.payload && props.payload.year === lastData.year) {
                  return (
                    <CustomLabel
                      x={props.x}
                      y={props.y}
                      value={props.value}
                      onClick={() => setIsYearlyModalOpen(true)}
                    />
                  );
                }
                return <g />;
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <YearlyDetailModal open={isYearlyModalOpen} onOpenChange={setIsYearlyModalOpen} year={selectedYear} />
    </div>
  );
}
