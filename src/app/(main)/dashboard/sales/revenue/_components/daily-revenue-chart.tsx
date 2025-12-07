"use client";

import { useState } from "react";

import { ChevronDown } from "lucide-react";
import { DateRange } from "react-day-picker";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface DailyRevenueChartProps {
  paymentMethod: "total" | "card" | "pos" | "transfer";
  onPaymentMethodChange: (method: "total" | "card" | "pos" | "transfer") => void;
}

const dailyData = [
  { time: "00", thisDay: 500000, lastDay: 450000 },
  { time: "06", thisDay: 1200000, lastDay: 1100000 },
  { time: "12", thisDay: 2500000, lastDay: 2300000 },
  { time: "18", thisDay: 3200000, lastDay: 3000000 },
  { time: "24", thisDay: 5000000, lastDay: 4800000 },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value?: string | number;
    name?: string;
    payload?: { time?: string };
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length > 0) {
    const firstPayload = payload[0];
    const secondPayload = payload[1];
    const time = firstPayload.payload?.time;
    const firstValue = typeof firstPayload.value === "number" ? firstPayload.value : 0;
    const secondValue = typeof secondPayload.value === "number" ? secondPayload.value : 0;

    return (
      <div className="bg-primary text-primary-foreground rounded-lg p-3 shadow-lg">
        <p className="mb-1 font-semibold">{time}시</p>
        <p className="text-sm">This Week : {firstValue.toLocaleString()}원</p>
        <p className="text-sm">Last Week : {secondValue.toLocaleString()}원</p>
      </div>
    );
  }
  return null;
}

export function DailyRevenueChart({ paymentMethod, onPaymentMethodChange }: DailyRevenueChartProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

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

        <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="w-[150px] justify-start text-left font-normal">
              Last Day
              <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
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

      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={dailyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="colorThisDay" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorLastDay" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--muted-foreground)" stopOpacity={0.2} />
              <stop offset="95%" stopColor="var(--muted-foreground)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="thisDay"
            stroke="var(--chart-1)"
            strokeWidth={3}
            fill="url(#colorThisDay)"
            name="This Day"
          />
          <Area
            type="monotone"
            dataKey="lastDay"
            stroke="var(--muted-foreground)"
            strokeWidth={1}
            fill="url(#colorLastDay)"
            name="Last Day"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
