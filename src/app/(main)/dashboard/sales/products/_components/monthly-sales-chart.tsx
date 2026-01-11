"use client";

import { useState, useEffect } from "react";

import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { DateRange } from "react-day-picker";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import { Label } from "@/components/ui/label";
import { MonthlyCalendar } from "@/components/ui/monthly-calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DEFAULT_CHART_MARGIN, formatNumberShort } from "@/lib/chart-utils";
import { getProductNet } from "@/service/sales.service";

interface MonthlySalesChartProps {
  selectedCategory: string | null;
  paymentMethod: "total" | "card" | "pos" | "transfer";
  onPaymentMethodChange: (method: "total" | "card" | "pos" | "transfer") => void;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value?: string | number;
    name?: string;
    payload?: { month?: string };
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length > 0) {
    const firstPayload = payload[0];
    const secondPayload = payload[1];
    const month = firstPayload.payload?.month;
    const firstValue = typeof firstPayload.value === "number" ? firstPayload.value : 0;
    const secondValue = typeof secondPayload.value === "number" ? secondPayload.value : 0;

    return (
      <div className="border-primary bg-primary text-primary-foreground rounded-lg border p-3 shadow-lg">
        <p className="mb-2 font-semibold">{month}</p>
        <p className="text-sm">This Month: {formatNumberShort(firstValue)}원</p>
        <p className="text-sm">Last Month: {formatNumberShort(secondValue)}원</p>
      </div>
    );
  }
  return null;
}

export function MonthlySalesChart({ selectedCategory, paymentMethod, onPaymentMethodChange }: MonthlySalesChartProps) {
  const today = new Date();
  const previousMonth = subMonths(today, 1);
  const previousMonthStart = startOfMonth(previousMonth);
  const previousMonthEnd = endOfMonth(previousMonth);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: previousMonthStart,
    to: previousMonthEnd,
  });
  const [monthlyData, setMonthlyData] = useState<Array<{ month: string; thisMonth: number; lastMonth: number }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  const startDateTimestamp = dateRange.from?.getTime();
  const endDateTimestamp = dateRange.to?.getTime();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const startDateStr = dateRange.from?.toISOString().split("T")[0];
        const endDate = dateRange.to?.toISOString().split("T")[0] ?? new Date().toISOString().split("T")[0];

        const apiPaymentMethod =
          paymentMethod === "total"
            ? "ALL"
            : paymentMethod === "card"
              ? "CARD"
              : paymentMethod === "pos"
                ? "POS"
                : "BANK_TRANSFER";

        if (!startDateStr) return;

        const response = await getProductNet({
          period: "MONTHLY",
          paymentMethod: apiPaymentMethod,
          startDate: startDateStr,
          endDate,
        });

        const transformedData = response.current.map((item, index) => {
          const date = new Date(item.date);
          const day = date.getDate();
          const lastItem = response.last[index];
          return {
            month: `${day}일`,
            thisMonth: item.value,
            lastMonth: lastItem?.value ?? 0,
          };
        });

        setMonthlyData(transformedData);
      } catch (error) {
        console.error("Failed to fetch monthly sales chart data:", error);
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

  const totalAmount = monthlyData.reduce((sum, item) => sum + item.thisMonth, 0);

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <RadioGroup
          value={paymentMethod}
          onValueChange={(value) => onPaymentMethodChange(value as typeof paymentMethod)}
        >
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <RadioGroupItem value="total" id="total" className="h-4 w-4 sm:h-5 sm:w-5" />
              <Label htmlFor="total" className="flex items-center gap-1 text-xs sm:text-sm">
                총매출
              </Label>
            </div>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <RadioGroupItem value="card" id="card" className="h-4 w-4 sm:h-5 sm:w-5" />
              <Label htmlFor="card" className="text-xs sm:text-sm">
                카드결제
              </Label>
            </div>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <RadioGroupItem value="pos" id="pos" className="h-4 w-4 sm:h-5 sm:w-5" />
              <Label htmlFor="pos" className="text-xs sm:text-sm">
                현장결제(POS)
              </Label>
            </div>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <RadioGroupItem value="transfer" id="transfer" className="h-4 w-4 sm:h-5 sm:w-5" />
              <Label htmlFor="transfer" className="text-xs sm:text-sm">
                계좌이체
              </Label>
            </div>
          </div>
        </RadioGroup>

        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          {selectedCategory && <span className="text-xs font-medium sm:text-sm">{selectedCategory}</span>}
          <span className="text-xs sm:text-sm">This Month</span>
          <div className="text-lg font-bold sm:text-2xl">{formatNumberShort(totalAmount)} 원</div>
          <MonthlyCalendar
            selectedMonth={dateRange}
            onMonthSelect={(range) => {
              setDateRange(range);
            }}
            placeholder="월 선택"
            buttonClassName="w-full text-xs sm:w-[150px] sm:text-sm"
          />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300} className="sm:h-[400px]">
        <AreaChart data={monthlyData} margin={{ ...DEFAULT_CHART_MARGIN, top: 5, right: 5, left: 5, bottom: 5 }}>
          <defs>
            <linearGradient id="colorThisMonth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorLastMonth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--muted-foreground)" stopOpacity={0.2} />
              <stop offset="95%" stopColor="var(--muted-foreground)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={{ fontSize: 10 }} className="sm:text-xs" />
          <YAxis
            tickFormatter={formatNumberShort}
            width={50}
            tick={{ fontSize: 10 }}
            className="sm:w-[60px] sm:text-xs"
          />
          <Tooltip content={<CustomTooltip />} contentStyle={{ fontSize: "12px" }} />
          <Area
            type="monotone"
            dataKey="thisMonth"
            stroke="var(--chart-1)"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorThisMonth)"
            className="sm:stroke-[3px]"
          />
          <Area
            type="monotone"
            dataKey="lastMonth"
            stroke="var(--muted-foreground)"
            strokeWidth={1}
            fillOpacity={1}
            fill="url(#colorLastMonth)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
