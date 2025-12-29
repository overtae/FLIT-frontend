"use client";

import { useState, useEffect } from "react";

import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getOrderKeywordTrend } from "@/service/sales.service";
import type { OrderPeriod } from "@/types/sales.type";

interface SearchTrendTableProps {
  period: "weekly" | "monthly" | "yearly";
  selectedDate?: Date;
}

const periodMap: Record<"weekly" | "monthly" | "yearly", OrderPeriod> = {
  weekly: "WEEKLY",
  monthly: "MONTHLY",
  yearly: "YEARLY",
};

export function SearchTrendTable({ period, selectedDate }: SearchTrendTableProps) {
  const [searchTrendData, setSearchTrendData] = useState<
    Array<{ rank: number; keyword: string; searchCount: number; bounceRate: number }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!selectedDate) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        let startDate: Date;
        let endDate: Date;

        switch (period) {
          case "weekly": {
            endDate = endOfWeek(selectedDate);
            startDate = startOfWeek(selectedDate);
            break;
          }
          case "monthly": {
            endDate = endOfMonth(selectedDate);
            startDate = startOfMonth(selectedDate);
            break;
          }
          case "yearly": {
            endDate = endOfYear(selectedDate);
            startDate = startOfYear(selectedDate);
            break;
          }
        }

        const data = await getOrderKeywordTrend({
          period: periodMap[period],
          startDate: format(startDate, "yyyy-MM-dd"),
          endDate: format(endDate, "yyyy-MM-dd"),
        });
        setSearchTrendData(data);
      } catch (error) {
        console.error("Failed to fetch search trend data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [period, selectedDate]);

  if (isLoading || !selectedDate) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }
  const top5 = searchTrendData.slice(0, 5);
  const bottom5 = searchTrendData.slice(5, 10);

  return (
    <div className="grid w-full grid-cols-2 gap-4">
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead className="align-top">Keyword</TableHead>
              <TableHead className="text-right align-top">Search</TableHead>
              <TableHead className="text-center">
                Bounce rate
                <br />
                <span className="text-xs">이탈률</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {top5.map((item) => (
              <TableRow key={item.rank}>
                <TableCell className="w-12 text-center text-sm">{item.rank}</TableCell>
                <TableCell className="text-sm">{item.keyword}</TableCell>
                <TableCell className="text-right text-sm">{item.searchCount.toLocaleString()}</TableCell>
                <TableCell className="text-center text-sm">{item.bounceRate}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead className="align-top">Keyword</TableHead>
              <TableHead className="text-right align-top">Search</TableHead>
              <TableHead className="text-center">
                Bounce rate
                <br />
                <span className="text-xs">이탈률</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bottom5.map((item) => (
              <TableRow key={item.rank}>
                <TableCell className="w-12 text-center text-sm">{item.rank}</TableCell>
                <TableCell className="text-sm">{item.keyword}</TableCell>
                <TableCell className="text-right text-sm">{item.searchCount.toLocaleString()}</TableCell>
                <TableCell className="text-center text-sm">{item.bounceRate}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
