"use client";

import { useState, useEffect } from "react";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumberShort } from "@/lib/chart-utils";
import { getCustomerGender, getCustomerAge } from "@/service/sales.service";

const COLORS = ["#0088FE", "#00C49F"];

export function CustomerDashboard() {
  const [genderData, setGenderData] = useState<Array<{ name: string; value: number }>>([]);
  const [ageData, setAgeData] = useState<Array<{ age: string; value: number }>>([]);
  const [rankingData, setRankingData] = useState<Array<{ rank: number; name: string; amount: number }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const targetDate = new Date().toISOString().split("T")[0];

        const [genderResponse, ageResponse] = await Promise.all([
          getCustomerGender({ targetDate }),
          getCustomerAge({ targetDate }),
        ]);

        const genderDataList: Array<{ name: string; value: number }> = [
          { name: "여성", value: genderResponse.ratio.female },
          { name: "남성", value: genderResponse.ratio.male },
          { name: "기타", value: genderResponse.ratio.etc },
        ];
        setGenderData(genderDataList);

        const ageDataList: Array<{ age: string; value: number }> = ageResponse.age.map((item) => ({
          age: item.label,
          value: item.value,
        }));
        setAgeData(ageDataList);

        const rankingDataList: Array<{ rank: number; name: string; amount: number }> =
          genderResponse.productsRanking.map((item) => ({
            rank: item.rank,
            name: item.productName,
            amount: item.count,
          }));
        setRankingData(rankingDataList);
      } catch (error) {
        console.error("Failed to fetch customer dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">성비</CardTitle>
            <CardDescription className="text-xs sm:text-sm">도넛그래프</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  innerRadius={40}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {genderData.map((entry) => (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={COLORS[genderData.findIndex((e) => e.name === entry.name) % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">나이</CardTitle>
            <CardDescription className="text-xs sm:text-sm">가로막대그래프</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
              <BarChart data={ageData} layout="vertical" margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={formatNumberShort} tick={{ fontSize: 10 }} className="sm:text-xs" />
                <YAxis
                  dataKey="age"
                  type="category"
                  tick={{ fontSize: 10 }}
                  width={40}
                  className="sm:w-auto sm:text-xs"
                />
                <Tooltip formatter={(value: number) => formatNumberShort(value)} contentStyle={{ fontSize: "12px" }} />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar dataKey="value" fill="#8884d8" name="인원수" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">순위</CardTitle>
          <CardDescription className="text-xs sm:text-sm">테이블 → 모달로 전체 순위</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full min-w-[300px]">
              <thead className="bg-muted">
                <tr>
                  <th className="px-2 py-1.5 text-left text-xs sm:px-4 sm:py-2 sm:text-sm">순위</th>
                  <th className="px-2 py-1.5 text-left text-xs sm:px-4 sm:py-2 sm:text-sm">이름</th>
                  <th className="px-2 py-1.5 text-right text-xs sm:px-4 sm:py-2 sm:text-sm">구매금액</th>
                </tr>
              </thead>
              <tbody>
                {rankingData.map((item) => (
                  <tr key={item.rank} className="border-b">
                    <td className="px-2 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm">{item.rank}</td>
                    <td className="px-2 py-1.5 text-xs break-words sm:px-4 sm:py-2 sm:text-sm">{item.name}</td>
                    <td className="px-2 py-1.5 text-right text-xs sm:px-4 sm:py-2 sm:text-sm">
                      {formatNumberShort(item.amount)}원
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">카테고리별 구매 현황</CardTitle>
          <CardDescription className="text-xs sm:text-sm">쌓인 막대그래프</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
            <BarChart data={ageData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="age" tick={{ fontSize: 10 }} className="sm:text-xs" />
              <YAxis tickFormatter={formatNumberShort} tick={{ fontSize: 10 }} className="sm:text-xs" />
              <Tooltip formatter={(value: number) => formatNumberShort(value)} contentStyle={{ fontSize: "12px" }} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar dataKey="value" stackId="a" fill="#8884d8" name="인원수" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
