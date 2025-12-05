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

interface DailySalesChartProps {
  selectedCategory: string | null;
  paymentMethod: "total" | "card" | "pos" | "transfer";
  onPaymentMethodChange: (method: "total" | "card" | "pos" | "transfer") => void;
}

const dailyData = [
  { date: "01", thisWeek: 5000000, lastWeek: 4500000 },
  { date: "02", thisWeek: 5200000, lastWeek: 4800000 },
  { date: "03", thisWeek: 4800000, lastWeek: 4400000 },
  { date: "04", thisWeek: 5500000, lastWeek: 5000000 },
  { date: "05", thisWeek: 5300000, lastWeek: 4900000 },
  { date: "06", thisWeek: 5100000, lastWeek: 4700000 },
  { date: "07", thisWeek: 5400000, lastWeek: 5100000 },
];

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
      <div className="border-primary bg-primary text-primary-foreground rounded-lg border p-3 shadow-lg">
        <p className="mb-2 font-semibold">{date}일</p>
        <p className="text-sm">This Week: {firstValue.toLocaleString()}원</p>
        <p className="text-sm">Last Week: {secondValue.toLocaleString()}원</p>
      </div>
    );
  }
  return null;
}

export function DailySalesChart({ selectedCategory, paymentMethod, onPaymentMethodChange }: DailySalesChartProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const totalAmount = dailyData.reduce((sum, item) => sum + item.thisWeek, 0);

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
          <span className="text-sm">Today</span>
          <div className="text-2xl font-bold">{totalAmount.toLocaleString()} 원</div>
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
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={dailyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorThisWeek" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorLastWeek" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="thisWeek" stroke="#8884d8" fillOpacity={1} fill="url(#colorThisWeek)" />
          <Area type="monotone" dataKey="lastWeek" stroke="#82ca9d" fillOpacity={1} fill="url(#colorLastWeek)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
