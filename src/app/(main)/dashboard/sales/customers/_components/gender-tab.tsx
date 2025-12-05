"use client";

import { useState } from "react";

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
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

const GENDER_COLORS = {
  여성: "#F472B6",
  남성: "#60A5FA",
  기타: "#9CA3AF",
};

const genderData = [
  { name: "여성", value: 60 },
  { name: "남성", value: 35 },
  { name: "기타", value: 5 },
];

const topItems = [
  { rank: 1, name: "꽃다발", count: 1250 },
  { rank: 2, name: "꽃바구니", count: 980 },
  { rank: 3, name: "동양난", count: 750 },
  { rank: 4, name: "서양난", count: 620 },
  { rank: 5, name: "다육식물", count: 580 },
];

const allItems = [
  { rank: 1, name: "꽃다발", count: 1250 },
  { rank: 2, name: "꽃바구니", count: 980 },
  { rank: 3, name: "동양난", count: 750 },
  { rank: 4, name: "서양난", count: 620 },
  { rank: 5, name: "다육식물", count: 580 },
  { rank: 6, name: "화분", count: 520 },
  { rank: 7, name: "공기정화", count: 480 },
  { rank: 8, name: "축하화환", count: 420 },
  { rank: 9, name: "근조화환", count: 380 },
  { rank: 10, name: "플랜테리어", count: 350 },
  { rank: 11, name: "가드닝", count: 320 },
  { rank: 12, name: "정기배송", count: 280 },
];

const stackedBarData = [
  { item: "꽃다발", 여성: 750, 남성: 400, 기타: 100 },
  { item: "꽃바구니", 여성: 600, 남성: 300, 기타: 80 },
  { item: "동양난", 여성: 450, 남성: 250, 기타: 50 },
  { item: "서양난", 여성: 380, 남성: 200, 기타: 40 },
  { item: "다육식물", 여성: 350, 남성: 180, 기타: 50 },
  { item: "화분", 여성: 320, 남성: 160, 기타: 40 },
  { item: "공기정화", 여성: 300, 남성: 140, 기타: 40 },
  { item: "축하화환", 여성: 260, 남성: 130, 기타: 30 },
  { item: "근조화환", 여성: 240, 남성: 110, 기타: 30 },
  { item: "플랜테리어", 여성: 220, 남성: 100, 기타: 30 },
  { item: "가드닝", 여성: 200, 남성: 90, 기타: 30 },
  { item: "정기배송", 여성: 180, 남성: 80, 기타: 20 },
];

interface GenderTabProps {
  selectedDate?: Date;
}

export function GenderTab({ selectedDate: _selectedDate }: GenderTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-4">
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

        <div className="col-span-1 h-full gap-0">
          <div className="flex flex-col items-center space-y-0">
            <h4 className="text-sm font-medium">순위</h4>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild className="place-self-end">
                <Button variant="ghost" size="sm" className="text-xs">
                  전체보기
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>전체 순위</DialogTitle>
                </DialogHeader>
                <div className="max-h-[500px] overflow-y-auto">
                  <Table>
                    <TableBody>
                      {allItems.map((item) => (
                        <TableRow key={item.rank}>
                          <TableCell className="w-16 text-center">{item.rank}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell className="text-right">{item.count.toLocaleString()}건</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </DialogContent>
            </Dialog>
            <Table>
              <TableBody>
                {topItems.map((item) => (
                  <TableRow key={item.rank}>
                    <TableCell className="w-12 text-center text-sm">{item.rank}</TableCell>
                    <TableCell className="text-sm">{item.name}</TableCell>
                    <TableCell className="text-right text-sm">{item.count.toLocaleString()}건</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          <Legend />
          <Bar dataKey="여성" stackId="a" fill={GENDER_COLORS.여성} />
          <Bar dataKey="남성" stackId="a" fill={GENDER_COLORS.남성} />
          <Bar dataKey="기타" stackId="a" fill={GENDER_COLORS.기타} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
