"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface SearchTrendTableProps {
  period: "weekly" | "monthly" | "yearly";
  selectedDate?: Date;
}

const searchTrendData = [
  { rank: 1, keyword: "장미", search: 1250, bounceRate: 25.5 },
  { rank: 2, keyword: "화분", search: 980, bounceRate: 30.2 },
  { rank: 3, keyword: "꽃다발", search: 850, bounceRate: 28.1 },
  { rank: 4, keyword: "식물", search: 720, bounceRate: 32.5 },
  { rank: 5, keyword: "화환", search: 650, bounceRate: 27.8 },
  { rank: 6, keyword: "다육식물", search: 580, bounceRate: 29.3 },
  { rank: 7, keyword: "공기정화", search: 520, bounceRate: 26.7 },
  { rank: 8, keyword: "플랜테리어", search: 480, bounceRate: 31.2 },
  { rank: 9, keyword: "가드닝", search: 420, bounceRate: 28.9 },
  { rank: 10, keyword: "정기배송", search: 380, bounceRate: 27.4 },
];

export function SearchTrendTable({ period: _period, selectedDate: _selectedDate }: SearchTrendTableProps) {
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
