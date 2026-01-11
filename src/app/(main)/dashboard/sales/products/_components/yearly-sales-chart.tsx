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
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DEFAULT_CHART_MARGIN, formatNumberShort } from "@/lib/chart-utils";
import { getProductNetYearly, getProductNetQuarter } from "@/service/sales.service";

import { QuarterDetailModal } from "./quarter-detail-modal";

interface YearlySalesChartProps {
  selectedCategory: string | null;
}

export function YearlySalesChart(_props: YearlySalesChartProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = _props;
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(String(currentYear));
  const [selectedYearRange, setSelectedYearRange] = useState([String(currentYear - 1), String(currentYear)]);
  const [isQuarterModalOpen, setIsQuarterModalOpen] = useState(false);
  const [quarterlyData, setQuarterlyData] = useState<
    Array<{ quarter: string; card: number; pos: number; transfer: number }>
  >([]);
  const [yearlyComparisonData, setYearlyComparisonData] = useState<Array<{ year: string; value: number }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const [startYear, endYear] = selectedYearRange;
        const yearlyData = await getProductNetYearly({
          startYear,
          endYear,
        });

        const quarterlyDataResponse = await getProductNetQuarter({
          targetYear: selectedYear,
        });

        const quarterlyDataList = [
          {
            quarter: "Q1",
            card: quarterlyDataResponse.reduce((sum, item) => sum + item.q1, 0),
            pos: 0,
            transfer: 0,
          },
          {
            quarter: "Q2",
            card: quarterlyDataResponse.reduce((sum, item) => sum + item.q2, 0),
            pos: 0,
            transfer: 0,
          },
          {
            quarter: "Q3",
            card: quarterlyDataResponse.reduce((sum, item) => sum + item.q3, 0),
            pos: 0,
            transfer: 0,
          },
          {
            quarter: "Q4",
            card: quarterlyDataResponse.reduce((sum, item) => sum + item.q4, 0),
            pos: 0,
            transfer: 0,
          },
        ];
        setQuarterlyData(quarterlyDataList);

        setYearlyComparisonData(yearlyData);
      } catch (error) {
        console.error("Failed to fetch yearly sales chart data:", error);
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
                {Array.from({ length: 4 }, (_, i) => currentYear - 3 + i).map((year) => (
                  <SelectItem key={year} value={String(year)}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsQuarterModalOpen(true)}>
            더보기 <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={quarterlyData} margin={{ ...DEFAULT_CHART_MARGIN, top: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="quarter" />
            <YAxis tickFormatter={formatNumberShort} width={60} />
            <Tooltip formatter={(value: number) => `${formatNumberShort(value)}원`} />
            <Legend />
            <Bar dataKey="card" stackId="a" fill="var(--chart-1)" name="카드" />
            <Bar dataKey="pos" stackId="a" fill="var(--chart-2)" name="현장결제" />
            <Bar dataKey="transfer" stackId="a" fill="var(--chart-3)" name="계좌이체" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="col-span-3">
        <div className="mb-4 flex items-center justify-between">
          <span className="font-semibold">연도별 추이 비교</span>
          <div className="flex items-center gap-2">
            <Select
              value={selectedYearRange[0]}
              onValueChange={(value) => setSelectedYearRange([value, selectedYearRange[1]])}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 4 }, (_, i) => currentYear - 4 + i).map((year) => (
                  <SelectItem key={year} value={String(year)}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-muted-foreground">~</span>
            <Select
              value={selectedYearRange[1]}
              onValueChange={(value) => setSelectedYearRange([selectedYearRange[0], value])}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 4 }, (_, i) => currentYear - 3 + i).map((year) => (
                  <SelectItem key={year} value={String(year)}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={yearlyComparisonData} margin={DEFAULT_CHART_MARGIN}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={formatNumberShort} width={60} />
            <Tooltip formatter={(value: number) => `${formatNumberShort(value)}원`} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--chart-1)"
              strokeWidth={3}
              dot={{ r: 6, fill: "var(--chart-1)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <QuarterDetailModal open={isQuarterModalOpen} onOpenChange={setIsQuarterModalOpen} year={selectedYear} />
    </div>
  );
}
