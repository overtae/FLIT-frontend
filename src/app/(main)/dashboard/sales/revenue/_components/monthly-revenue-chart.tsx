"use client";

import { useState } from "react";

import { ChevronDown } from "lucide-react";
import { DateRange } from "react-day-picker";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface MonthlyRevenueChartProps {
  paymentMethod: "total" | "card" | "pos" | "transfer";
  onPaymentMethodChange: (method: "total" | "card" | "pos" | "transfer") => void;
}

const monthlyData = [
  { date: "01", thisMonth: 120000000, lastMonth: 110000000 },
  { date: "05", thisMonth: 130000000, lastMonth: 120000000 },
  { date: "10", thisMonth: 140000000, lastMonth: 130000000 },
  { date: "15", thisMonth: 135000000, lastMonth: 125000000 },
  { date: "20", thisMonth: 145000000, lastMonth: 135000000 },
  { date: "25", thisMonth: 150000000, lastMonth: 140000000 },
  { date: "31", thisMonth: 160000000, lastMonth: 150000000 },
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
      <div className="space-y-2">
        <div className="border-primary bg-primary text-primary-foreground rounded-lg border p-3 shadow-lg">
          <p className="mb-1 font-semibold">{date}일</p>
          <p className="text-sm">This Month: {firstValue.toLocaleString()}원</p>
        </div>
        <div className="border-primary bg-primary text-primary-foreground rounded-lg border p-3 shadow-lg">
          <p className="text-sm">Last Month: {secondValue.toLocaleString()}원</p>
        </div>
      </div>
    );
  }
  return null;
}

export function MonthlyRevenueChart({ paymentMethod, onPaymentMethodChange }: MonthlyRevenueChartProps) {
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

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="thisMonth"
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            dot={{ r: 5, fill: "hsl(var(--primary))" }}
            name="This Month"
          />
          <Line
            type="monotone"
            dataKey="lastMonth"
            stroke="hsl(var(--muted-foreground))"
            strokeWidth={1}
            dot={{ r: 3, fill: "hsl(var(--muted-foreground))" }}
            name="Last Month"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
