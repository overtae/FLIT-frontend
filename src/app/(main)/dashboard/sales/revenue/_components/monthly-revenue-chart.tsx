"use client";

import { useState, useEffect } from "react";

import { ChevronDown } from "lucide-react";
import { DateRange } from "react-day-picker";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DEFAULT_CHART_MARGIN, formatNumberShort } from "@/lib/chart-utils";
import { getRevenueNet } from "@/service/sales.service";

interface MonthlyRevenueChartProps {
  paymentMethod: "total" | "card" | "pos" | "transfer";
  onPaymentMethodChange: (method: "total" | "card" | "pos" | "transfer") => void;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value?: string | number;
    name?: string;
    payload?: { date?: string };
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length > 0) {
    const firstPayload = payload[0];
    const secondPayload = payload[1];
    const date = firstPayload.payload?.date;
    const firstValue = typeof firstPayload.value === "number" ? firstPayload.value : 0;
    const secondValue = typeof secondPayload.value === "number" ? secondPayload.value : 0;

    return (
      <div className="bg-primary text-primary-foreground rounded-lg p-3 shadow-lg">
        <p className="mb-1 font-semibold">{date}일</p>
        <p className="text-sm">This Week : {formatNumberShort(firstValue)}원</p>
        <p className="text-sm">Last Week : {formatNumberShort(secondValue)}원</p>
      </div>
    );
  }
  return null;
}

export function MonthlyRevenueChart({ paymentMethod, onPaymentMethodChange }: MonthlyRevenueChartProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [monthlyData, setMonthlyData] = useState<Array<{ date: string; thisMonth: number; lastMonth: number }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const today = new Date();
        const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        const endDate = today.toISOString().split("T")[0];
        const startDateStr = startDate.toISOString().split("T")[0];

        const apiPaymentMethod =
          paymentMethod === "total"
            ? "ALL"
            : paymentMethod === "card"
              ? "CARD"
              : paymentMethod === "pos"
                ? "POS"
                : "BANK_TRANSFER";

        const response = await getRevenueNet({
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
            date: `${day}일`,
            thisMonth: item.value,
            lastMonth: lastItem?.value ?? 0,
          };
        });

        setMonthlyData(transformedData);
      } catch (error) {
        console.error("Failed to fetch monthly revenue chart data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [paymentMethod]);

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

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

        <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start text-left text-xs font-normal sm:w-[150px] sm:text-sm"
            >
              Last Month
              <ChevronDown className="ml-auto h-3.5 w-3.5 opacity-50 sm:h-4 sm:w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <CalendarComponent
              mode="range"
              selected={dateRange}
              onSelect={(range) => {
                setDateRange(range);
                setIsDatePickerOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
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
          <XAxis dataKey="date" tick={{ fontSize: 10 }} className="sm:text-xs" />
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
            fill="url(#colorThisMonth)"
            name="This Month"
            className="sm:stroke-[3px]"
          />
          <Area
            type="monotone"
            dataKey="lastMonth"
            stroke="var(--muted-foreground)"
            strokeWidth={1}
            fill="url(#colorLastMonth)"
            name="Last Month"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
