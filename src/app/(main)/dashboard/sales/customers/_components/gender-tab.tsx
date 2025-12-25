"use client";

import { useState, useEffect } from "react";

import { X } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getCustomerAnalysis } from "@/service/customer-analysis.service";
import { GenderData, ItemRanking, StackedBarData } from "@/types/customer-analysis";

interface GenderTabProps {
  selectedDate?: Date;
}

const GENDER_COLORS = {
  여성: "var(--chart-1)",
  남성: "var(--chart-3)",
  기타: "var(--chart-5)",
};

export function GenderTab({ selectedDate }: GenderTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [genderData, setGenderData] = useState<GenderData[]>([]);
  const [topItems, setTopItems] = useState<ItemRanking[]>([]);
  const [allItems, setAllItems] = useState<ItemRanking[]>([]);
  const [stackedBarData, setStackedBarData] = useState<StackedBarData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const params = {
          period: "last-month" as const,
          date: selectedDate ? selectedDate.toISOString().split("T")[0] : undefined,
        };
        const response = await getCustomerAnalysis(params);
        setGenderData(response.genderData);
        setTopItems(response.topItems);
        setAllItems(response.allItems);
        setStackedBarData(response.stackedBarData);
      } catch (error) {
        console.error("Failed to fetch customer analysis:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedDate]);

  interface CustomLabelProps {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
  }

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: CustomLabelProps) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-sm font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-3">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={genderData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={100}
                innerRadius={50}
                fill="#8884d8"
                dataKey="value"
              >
                {genderData.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={GENDER_COLORS[entry.name as keyof typeof GENDER_COLORS]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="col-span-1 flex flex-col justify-center gap-3">
          <div className="flex flex-col gap-3">
            {genderData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div
                  className="h-4 w-4 rounded"
                  style={{ backgroundColor: GENDER_COLORS[entry.name as keyof typeof GENDER_COLORS] }}
                />
                <span className="text-sm">{entry.name}</span>
                <span className="text-muted-foreground text-sm">{entry.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-1 h-full gap-0">
          <div className="flex flex-col items-center space-y-0">
            <h4 className="text-sm font-medium">순위</h4>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild className="place-self-end">
                <Button variant="ghost" size="sm" className="px-0 text-xs">
                  전체보기
                </Button>
              </DialogTrigger>
              <DialogContent className="min-w-4xl">
                <DialogHeader className="relative mb-4">
                  <DialogTitle className="text-center">전체 순위</DialogTitle>
                  <Button
                    size="icon"
                    onClick={() => setIsDialogOpen(false)}
                    className="bg-muted text-foreground hover:bg-muted-hover absolute -top-2 right-0 rounded-full"
                  >
                    <X />
                  </Button>
                </DialogHeader>
                <div className="max-h-[500px] overflow-y-auto">
                  <div className="grid w-full grid-flow-col grid-cols-2 grid-rows-6 gap-6">
                    {allItems.map((item) => (
                      <div key={item.rank} className="flex items-center gap-4">
                        <div className="w-16 text-center">{item.rank}</div>
                        <div className="border-border flex flex-1 items-center justify-between gap-2 rounded-lg border p-3">
                          <div>{item.name}</div>
                          <div>{item.count.toLocaleString()}건</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <div className="space-y-2">
              {topItems.map((item) => (
                <div key={item.rank} className="min-w-60">
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-semibold">{item.rank}위</div>

                    <div className="border-border flex flex-1 items-center justify-between gap-2 rounded-lg border p-3">
                      <span className="text-sm">{item.name}</span>
                      <span className="text-sm font-semibold">{item.count.toLocaleString()}건</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={stackedBarData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="item" angle={-45} textAnchor="end" height={100} />
          <YAxis hide />
          <Tooltip
            formatter={(value: number) => `${value}건`}
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "0.5rem",
            }}
          />
          <Legend />
          <Bar dataKey="여성" stackId="a" fill={GENDER_COLORS.여성} className="aspect-square" />
          <Bar dataKey="남성" stackId="a" fill={GENDER_COLORS.남성} />
          <Bar dataKey="기타" stackId="a" fill={GENDER_COLORS.기타} fillOpacity={0.5} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
