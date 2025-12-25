"use client";

import { useState, useEffect } from "react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getSearchTrendData } from "@/lib/api/dashboard";

interface SearchTrendTableProps {
  period: "weekly" | "monthly" | "yearly";
  selectedDate?: Date;
}

export function SearchTrendTable({ period }: SearchTrendTableProps) {
  const [searchTrendData, setSearchTrendData] = useState<
    Array<{ rank: number; keyword: string; search: number; bounceRate: number }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getSearchTrendData({ period });
        setSearchTrendData(data);
      } catch (error) {
        console.error("Failed to fetch search trend data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [period]);

  if (isLoading) {
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
                <TableCell className="text-right text-sm">{item.search.toLocaleString()}</TableCell>
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
                <TableCell className="text-right text-sm">{item.search.toLocaleString()}</TableCell>
                <TableCell className="text-center text-sm">{item.bounceRate}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
