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
import { getYearlySalesChartData } from "@/lib/api/dashboard";
import { DEFAULT_CHART_MARGIN, formatYAxisValueShort } from "@/lib/chart-utils";

import { QuarterDetailModal } from "./quarter-detail-modal";

interface YearlySalesChartProps {
  selectedCategory: string | null;
}

export function YearlySalesChart(_props: YearlySalesChartProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = _props;
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedYearRange, setSelectedYearRange] = useState(["2020", "2023"]);
  const [isQuarterModalOpen, setIsQuarterModalOpen] = useState(false);
  const [quarterlyData, setQuarterlyData] = useState<
    Array<{ quarter: string; card: number; pos: number; transfer: number }>
  >([]);
  const [yearlyComparisonData, setYearlyComparisonData] = useState<
    Array<{ month: string; [key: string]: number | string }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getYearlySalesChartData(selectedYear, selectedYearRange.join("-"));
        setQuarterlyData(data.quarterlyData);
        setYearlyComparisonData(data.yearlyComparisonData);
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
                <SelectItem value="2020">2020</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
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
            <YAxis tickFormatter={formatYAxisValueShort} width={60} />
            <Tooltip formatter={(value: number) => `${value.toLocaleString()}원`} />
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
          <Select value={selectedYearRange.join("-")} onValueChange={(value) => setSelectedYearRange(value.split("-"))}>
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
          <LineChart data={yearlyComparisonData} margin={DEFAULT_CHART_MARGIN}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={formatYAxisValueShort} width={60} />
            <Tooltip formatter={(value: number) => `${value.toLocaleString()}원`} />
            <Legend />
            <Line type="monotone" dataKey="2020" stroke="var(--muted-foreground)" name="2020" strokeWidth={1} />
            <Line type="monotone" dataKey="2021" stroke="var(--muted-foreground)" name="2021" strokeWidth={1} />
            <Line type="monotone" dataKey="2022" stroke="var(--muted-foreground)" name="2022" strokeWidth={1} />
            <Line type="monotone" dataKey="2023" stroke="var(--chart-1)" name="2023" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <QuarterDetailModal open={isQuarterModalOpen} onOpenChange={setIsQuarterModalOpen} year={selectedYear} />
    </div>
  );
}
