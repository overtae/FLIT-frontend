"use client";

import { useState } from "react";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

const ageData = [
  { age: "10대", count: 120 },
  { age: "20대", count: 450 },
  { age: "30대", count: 380 },
  { age: "40대", count: 220 },
  { age: "50대", count: 150 },
  { age: "60대", count: 80 },
  { age: "70대+", count: 40 },
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
  {
    item: "꽃다발",
    "10대": 50,
    "20대": 350,
    "30대": 400,
    "40대": 250,
    "50대": 150,
    "60대": 40,
    "70대+": 10,
  },
  {
    item: "꽃바구니",
    "10대": 40,
    "20대": 280,
    "30대": 320,
    "40대": 200,
    "50대": 100,
    "60대": 30,
    "70대+": 10,
  },
  {
    item: "동양난",
    "10대": 30,
    "20대": 200,
    "30대": 250,
    "40대": 150,
    "50대": 80,
    "60대": 30,
    "70대+": 10,
  },
  {
    item: "서양난",
    "10대": 25,
    "20대": 180,
    "30대": 200,
    "40대": 120,
    "50대": 70,
    "60대": 20,
    "70대+": 5,
  },
  {
    item: "다육식물",
    "10대": 20,
    "20대": 170,
    "30대": 190,
    "40대": 110,
    "50대": 60,
    "60대": 25,
    "70대+": 5,
  },
  {
    item: "화분",
    "10대": 18,
    "20대": 150,
    "30대": 180,
    "40대": 100,
    "50대": 50,
    "60대": 20,
    "70대+": 2,
  },
  {
    item: "공기정화",
    "10대": 15,
    "20대": 140,
    "30대": 170,
    "40대": 90,
    "50대": 45,
    "60대": 15,
    "70대+": 0,
  },
  {
    item: "축하화환",
    "10대": 12,
    "20대": 120,
    "30대": 150,
    "40대": 80,
    "50대": 40,
    "60대": 15,
    "70대+": 3,
  },
  {
    item: "근조화환",
    "10대": 10,
    "20대": 100,
    "30대": 130,
    "40대": 70,
    "50대": 50,
    "60대": 18,
    "70대+": 2,
  },
  {
    item: "플랜테리어",
    "10대": 8,
    "20대": 90,
    "30대": 120,
    "40대": 60,
    "50대": 50,
    "60대": 25,
    "70대+": 7,
  },
  {
    item: "가드닝",
    "10대": 5,
    "20대": 80,
    "30대": 110,
    "40대": 55,
    "50대": 50,
    "60대": 20,
    "70대+": 0,
  },
  {
    item: "정기배송",
    "10대": 3,
    "20대": 70,
    "30대": 100,
    "40대": 50,
    "50대": 40,
    "60대": 15,
    "70대+": 2,
  },
];

interface AgeTabProps {
  selectedDate?: Date;
}

export function AgeTab(_props: AgeTabProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = _props;
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
            <div className="space-y-2">
              {topItems.map((item) => (
                <div
                  key={item.rank}
                  className="bg-card border-border rounded-lg border p-3 shadow-md transition-shadow hover:shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{item.rank}위</span>
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <span className="text-sm font-semibold">{item.count.toLocaleString()}건</span>
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
