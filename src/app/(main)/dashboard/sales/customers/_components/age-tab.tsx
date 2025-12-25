"use client";

import { useState, useEffect } from "react";

import { X } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getCustomerAnalysis } from "@/service/customer-analysis.service";
import { AgeData, ItemRanking, StackedBarData } from "@/types/customer-analysis";

interface AgeTabProps {
  selectedDate?: Date;
}

export function AgeTab({ selectedDate }: AgeTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [ageData, setAgeData] = useState<AgeData[]>([]);
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
        setAgeData(response.ageData);
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
        <div className="col-span-4">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ageData} layout="vertical" margin={{ top: 5, right: 80, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" hide />
              <YAxis dataKey="age" type="category" width={60} />
              <Tooltip formatter={(value: number) => `${value}명`} />
              <Bar
                dataKey="count"
                radius={[0, 4, 4, 0]}
                label={{ position: "right", formatter: (value: number) => `${value}명` }}
              >
                {ageData.map((entry) => (
                  <Cell key={`cell-${entry.age}`} fill="var(--chart-1)" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
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
          <Bar dataKey="10대" stackId="a" fill="var(--chart-1)" />
          <Bar dataKey="20대" stackId="a" fill="var(--chart-1)" />
          <Bar dataKey="30대" stackId="a" fill="var(--chart-1)" />
          <Bar dataKey="40대" stackId="a" fill="var(--chart-1)" />
          <Bar dataKey="50대" stackId="a" fill="var(--chart-1)" />
          <Bar dataKey="60대" stackId="a" fill="var(--chart-1)" />
          <Bar dataKey="70대+" stackId="a" fill="var(--chart-1)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
