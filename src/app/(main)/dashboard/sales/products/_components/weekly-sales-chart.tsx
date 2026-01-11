"use client";

import { useState, useEffect } from "react";

import { endOfWeek, format, startOfWeek, subWeeks } from "date-fns";
import { DateRange } from "react-day-picker";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { WeeklyCalendar } from "@/components/ui/weekly-calendar";
import { DEFAULT_CHART_MARGIN, formatNumberShort } from "@/lib/chart-utils";
import { getProductNet } from "@/service/sales.service";

interface WeeklySalesChartProps {
  selectedCategory: string | null;
  paymentMethod: "total" | "card" | "pos" | "transfer";
  onPaymentMethodChange: (method: "total" | "card" | "pos" | "transfer") => void;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value?: string | number;
    name?: string;
    payload?: { day?: string };
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length > 0) {
    const firstPayload = payload[0];
    const secondPayload = payload[1];
    const day = firstPayload.payload?.day;
    const firstValue = typeof firstPayload.value === "number" ? firstPayload.value : 0;
    const secondValue = typeof secondPayload.value === "number" ? secondPayload.value : 0;

    return (
      <div className="border-primary bg-primary text-primary-foreground rounded-lg border p-3 shadow-lg">
        <p className="mb-2 font-semibold">{day}</p>
        <p className="text-sm">This Week: {formatNumberShort(firstValue)}원</p>
        <p className="text-sm">Last Week: {formatNumberShort(secondValue)}원</p>
      </div>
    );
  }
  return null;
}

export function WeeklySalesChart({ selectedCategory, paymentMethod, onPaymentMethodChange }: WeeklySalesChartProps) {
  const today = new Date();
  const previousWeek = subWeeks(today, 1);
  const previousWeekStart = startOfWeek(previousWeek, { weekStartsOn: 0 });
  const previousWeekEnd = endOfWeek(previousWeek, { weekStartsOn: 0 });
  const [dateRange, setDateRange] = useState<DateRange>({
    from: previousWeekStart,
    to: previousWeekEnd,
  });
  const [weeklyData, setWeeklyData] = useState<Array<{ day: string; thisWeek: number; lastWeek: number }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  const startDateTimestamp = dateRange.from?.getTime();
  const endDateTimestamp = dateRange.to?.getTime();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const startDateStr = dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : "";
        const endDate = dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : "";

        if (!startDateStr || !endDate) return;

        const apiPaymentMethod =
          paymentMethod === "total"
            ? "ALL"
            : paymentMethod === "card"
              ? "CARD"
              : paymentMethod === "pos"
                ? "POS"
                : "BANK_TRANSFER";

        const response = await getProductNet({
          period: "WEEKLY",
          paymentMethod: apiPaymentMethod,
          startDate: startDateStr,
          endDate,
        });

        const transformedData = response.current.map((item, index) => {
          const date = new Date(item.date);
          const day = date.getDate();
          const lastItem = response.last[index];
          return {
            day: `${day}일`,
            thisWeek: item.value,
            lastWeek: lastItem?.value ?? 0,
          };
        });

        setWeeklyData(transformedData);
      } catch (error) {
        console.error("Failed to fetch weekly sales chart data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [paymentMethod, selectedCategory, startDateTimestamp, endDateTimestamp, dateRange.from, dateRange.to]);

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const totalAmount = weeklyData.reduce((sum, item) => sum + item.thisWeek, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <RadioGroup
          value={paymentMethod}
          onValueChange={(value) => onPaymentMethodChange(value as typeof paymentMethod)}
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="total" id="total" />
              <Label htmlFor="total" className="flex items-center gap-1">
                총매출
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card">카드결제</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pos" id="pos" />
              <Label htmlFor="pos">현장결제(POS)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="transfer" id="transfer" />
              <Label htmlFor="transfer">계좌이체</Label>
            </div>
          </div>
        </RadioGroup>

        <div className="flex items-center gap-4">
          {selectedCategory && <span className="text-sm font-medium">{selectedCategory}</span>}
          <span className="text-sm">This Week</span>
          <div className="text-2xl font-bold">{formatNumberShort(totalAmount)} 원</div>
          <WeeklyCalendar selectedWeekRange={dateRange} onWeekSelect={setDateRange} />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={weeklyData} margin={DEFAULT_CHART_MARGIN}>
          <defs>
            <linearGradient id="colorThisWeek" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorLastWeek" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--muted-foreground)" stopOpacity={0.2} />
              <stop offset="95%" stopColor="var(--muted-foreground)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis tickFormatter={formatNumberShort} width={60} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="thisWeek"
            stroke="var(--chart-1)"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorThisWeek)"
          />
          <Area
            type="monotone"
            dataKey="lastWeek"
            stroke="var(--muted-foreground)"
            strokeWidth={1}
            fillOpacity={1}
            fill="url(#colorLastWeek)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
