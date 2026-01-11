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
import { getCustomerGender } from "@/service/sales.service";
import type { CustomerGenderResponse } from "@/types/sales.type";

interface GenderTabProps {
  selectedDate?: Date;
}

const GENDER_COLORS = {
  여성: "var(--chart-1)",
  남성: "var(--chart-3)",
  기타: "var(--chart-5)",
};

interface GenderData {
  name: string;
  value: number;
}

interface ItemRanking {
  rank: number;
  name: string;
  count: number;
}

interface StackedBarData {
  item: string;
  여성: number;
  남성: number;
  기타: number;
}

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
        const targetDate = selectedDate
          ? selectedDate.toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0];
        const response: CustomerGenderResponse = await getCustomerGender({ targetDate });

        const genderDataList: GenderData[] = [
          { name: "여성", value: response.ratio.female },
          { name: "남성", value: response.ratio.male },
          { name: "기타", value: response.ratio.etc },
        ];
        setGenderData(genderDataList);

        const topItemsList: ItemRanking[] = response.productsRanking.slice(0, 5).map((item) => ({
          rank: item.rank,
          name: item.productName,
          count: item.count,
        }));
        setTopItems(topItemsList);

        const allItemsList: ItemRanking[] = response.productsRanking.map((item) => ({
          rank: item.rank,
          name: item.productName,
          count: item.count,
        }));
        setAllItems(allItemsList);

        const stackedBarDataList: StackedBarData[] = response.products.map((product) => ({
          item: product.productName,
          여성: product.female,
          남성: product.male,
          기타: product.etc,
        }));
        setStackedBarData(stackedBarDataList);
      } catch (error) {
        console.error("Failed to fetch customer gender:", error);
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
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-5 sm:gap-6">
        <div className="col-span-1 sm:col-span-3">
          <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
            <PieChart>
              <Pie
                data={genderData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={80}
                innerRadius={40}
                fill="#8884d8"
                dataKey="value"
                className="sm:outerRadius-[100px] sm:innerRadius-[50px]"
              >
                {genderData.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={GENDER_COLORS[entry.name as keyof typeof GENDER_COLORS]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="col-span-1 flex flex-col justify-center gap-2 sm:gap-3">
          <div className="flex flex-col gap-2 sm:gap-3">
            {genderData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded sm:h-4 sm:w-4"
                  style={{ backgroundColor: GENDER_COLORS[entry.name as keyof typeof GENDER_COLORS] }}
                />
                <span className="text-xs sm:text-sm">{entry.name}</span>
                <span className="text-muted-foreground text-xs sm:text-sm">{entry.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-1 h-full gap-0">
          <div className="flex flex-col items-center space-y-0">
            <h4 className="text-xs font-medium sm:text-sm">순위</h4>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild className="place-self-end">
                <Button variant="ghost" size="sm" className="px-0 text-xs">
                  전체보기
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] w-[95vw] max-w-4xl p-4 sm:p-6">
                <DialogHeader className="relative mb-3 sm:mb-4">
                  <DialogTitle className="text-center text-sm sm:text-base">전체 순위</DialogTitle>
                  <Button
                    size="icon"
                    onClick={() => setIsDialogOpen(false)}
                    className="bg-muted text-foreground hover:bg-muted-hover absolute -top-2 right-0 h-6 w-6 rounded-full sm:h-8 sm:w-8"
                  >
                    <X className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </DialogHeader>
                <div className="max-h-[400px] overflow-y-auto sm:max-h-[500px]">
                  <div className="grid w-full grid-cols-1 gap-3 sm:grid-flow-col sm:grid-cols-2 sm:grid-rows-6 sm:gap-6">
                    {allItems.map((item) => (
                      <div key={item.rank} className="flex items-center gap-2 sm:gap-4">
                        <div className="w-12 text-center text-xs sm:w-16 sm:text-sm">{item.rank}</div>
                        <div className="border-border flex flex-1 items-center justify-between gap-2 rounded-lg border p-2 text-xs sm:p-3 sm:text-sm">
                          <div className="truncate">{item.name}</div>
                          <div className="shrink-0">{item.count.toLocaleString()}건</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <div className="w-full space-y-2">
              {topItems.map((item) => (
                <div key={item.rank} className="w-full">
                  <div className="flex items-center gap-2 sm:gap-4">
                    <div className="text-xs font-semibold sm:text-sm">{item.rank}위</div>

                    <div className="border-border flex flex-1 items-center justify-between gap-2 rounded-lg border p-2 sm:p-3">
                      <span className="truncate text-xs sm:text-sm">{item.name}</span>
                      <span className="shrink-0 text-xs font-semibold sm:text-sm">{item.count.toLocaleString()}건</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300} className="sm:h-[400px]">
        <BarChart data={stackedBarData} margin={{ top: 10, right: 10, left: 10, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="item"
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fontSize: 10 }}
            className="sm:h-[100px] sm:text-xs"
          />
          <YAxis hide />
          <Tooltip
            formatter={(value: number) => `${value}건`}
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "0.5rem",
              fontSize: "12px",
            }}
          />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
          <Bar dataKey="여성" stackId="a" fill={GENDER_COLORS.여성} className="aspect-square" />
          <Bar dataKey="남성" stackId="a" fill={GENDER_COLORS.남성} />
          <Bar dataKey="기타" stackId="a" fill={GENDER_COLORS.기타} fillOpacity={0.5} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
