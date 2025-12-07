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

interface MonthlySalesChartProps {
  selectedCategory: string | null;
  paymentMethod: "total" | "card" | "pos" | "transfer";
  onPaymentMethodChange: (method: "total" | "card" | "pos" | "transfer") => void;
}

const monthlyData = [
  { month: "1월", thisMonth: 120000000, lastMonth: 110000000 },
  { month: "2월", thisMonth: 130000000, lastMonth: 120000000 },
  { month: "3월", thisMonth: 140000000, lastMonth: 130000000 },
  { month: "4월", thisMonth: 135000000, lastMonth: 125000000 },
  { month: "5월", thisMonth: 145000000, lastMonth: 135000000 },
  { month: "6월", thisMonth: 150000000, lastMonth: 140000000 },
];

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
        <p className="text-sm">This Month: {firstValue.toLocaleString()}원</p>
        <p className="text-sm">Last Month: {secondValue.toLocaleString()}원</p>
      </div>
    );
  }
  return null;
}

export function MonthlySalesChart({ selectedCategory, paymentMethod, onPaymentMethodChange }: MonthlySalesChartProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const totalAmount = monthlyData.reduce((sum, item) => sum + item.thisMonth, 0);

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
          <span className="text-sm">This Month</span>
          <div className="text-2xl font-bold">{totalAmount.toLocaleString()} 원</div>
          <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="w-[150px] justify-start text-left font-normal">
                Last Month
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
        <AreaChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="thisMonth"
            stroke="var(--chart-1)"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorThisMonth)"
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
