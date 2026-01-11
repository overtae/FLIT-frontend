"use client";

import { useState, useEffect } from "react";

import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Tooltip, XAxis } from "recharts";

import { Subtitle } from "@/components/ui/subtitle";
import { formatNumberShort } from "@/lib/chart-utils";
import { getUserStatisticsOverview, getSecederStatisticsOverview } from "@/service/user.service";
import type { UserType } from "@/types/user.type";

import { UserTotalChart } from "./user-total-chart";

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)"];

interface UserOverviewProps {
  category?: string;
}

const QUICK_STATS_LABELS: Record<
  string,
  { labels: [string, string, string, string]; titles: [string, string, string, string] }
> = {
  all: {
    labels: ["전체 고객 수", "전체 꽃집 수", "전체 플로리스트 수", "탈퇴 회원 수"],
    titles: ["Customer", "Store", "Florist", "Out"],
  },
  customer: {
    labels: ["전체 고객 수", "신규 회원 수", "탈퇴 회원 수", "상품 구매 갯수"],
    titles: ["Customer", "New", "Out", "Buying"],
  },
  shop: {
    labels: ["전체 고객 수", "신규 회원 수", "탈퇴 회원 수", "상품 판매 갯수"],
    titles: ["Customer", "New", "Out", "Buying"],
  },
  florist: {
    labels: ["전체 고객 수", "신규 회원 수", "탈퇴 회원 수", "상품 판매 갯수"],
    titles: ["Customer", "New", "Out", "Buying"],
  },
  seceder: {
    labels: ["전체 탈퇴 회원 수", "소비자 탈퇴 수", "가게 탈퇴 수", "플로리스트 탈퇴 수"],
    titles: ["All", "Customer", "Shop", "Florist"],
  },
};

export function UserOverview({ category = "all" }: UserOverviewProps) {
  const [customerType] = useState<"all" | "individual" | "corporate">("all");
  const [genderData, setGenderData] = useState<Array<{ name: string; value: number }>>([]);
  const [ageData, setAgeData] = useState<Array<{ name: string; value: number }>>([]);
  const [quickStats, setQuickStats] = useState({
    customer: { total: 0, change: 0, label: "전체 고객 수" },
    store: { total: 0, change: 0, label: "전체 꽃집 수" },
    florist: { total: 0, change: 0, label: "전체 플로리스트 수" },
    out: { total: 0, change: 0, label: "탈퇴 회원 수" },
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setIsLoading(true);

        const typeMap: Record<"all" | "individual" | "corporate", "ALL" | UserType> = {
          all: "ALL",
          individual: "CUSTOMER_INDIVIDUAL",
          corporate: "CUSTOMER_OWNER",
        };

        const overviewResponse =
          category === "seceder"
            ? await getSecederStatisticsOverview()
            : await getUserStatisticsOverview({
                type: category === "customer" ? typeMap[customerType] : "ALL",
              });

        const genderTotal = overviewResponse.gender.male + overviewResponse.gender.female + overviewResponse.gender.etc;
        setGenderData([
          { name: "남성", value: genderTotal > 0 ? Math.round((overviewResponse.gender.male / genderTotal) * 100) : 0 },
          {
            name: "여성",
            value: genderTotal > 0 ? Math.round((overviewResponse.gender.female / genderTotal) * 100) : 0,
          },
          { name: "기타", value: genderTotal > 0 ? Math.round((overviewResponse.gender.etc / genderTotal) * 100) : 0 },
        ]);

        setAgeData(overviewResponse.age.map((item) => ({ name: item.label, value: item.value })));

        if (overviewResponse.stats.length >= 4) {
          const config = QUICK_STATS_LABELS[category] ?? QUICK_STATS_LABELS.all;
          setQuickStats({
            customer: {
              total: overviewResponse.stats[0]?.total ?? 0,
              change: overviewResponse.stats[0]?.changed ?? 0,
              label: config.labels[0],
            },
            store: {
              total: overviewResponse.stats[1]?.total ?? 0,
              change: overviewResponse.stats[1]?.changed ?? 0,
              label: config.labels[1],
            },
            florist: {
              total: overviewResponse.stats[2]?.total ?? 0,
              change: overviewResponse.stats[2]?.changed ?? 0,
              label: config.labels[2],
            },
            out: {
              total: overviewResponse.stats[3]?.total ?? 0,
              change: overviewResponse.stats[3]?.changed ?? 0,
              label: config.labels[3],
            },
          });
        }
      } catch (error) {
        console.error("Failed to fetch user overview:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOverview();
  }, [category, customerType]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      {/* Top Section: Total User & Quick Stats */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 md:gap-8">
        {/* 1. Total User Chart */}
        <UserTotalChart category={category} />

        {/* 2. Quick Stats */}
        <section className="flex flex-col justify-center gap-2 sm:gap-3">
          <h3 className="text-base font-bold sm:text-lg md:text-xl">Quick Stats</h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3 md:gap-4">
            {(() => {
              const config = QUICK_STATS_LABELS[category] ?? QUICK_STATS_LABELS.all;
              const stats = [
                { key: "customer", data: quickStats.customer },
                { key: "store", data: quickStats.store },
                { key: "florist", data: quickStats.florist },
                { key: "out", data: quickStats.out },
              ];
              return stats.map((stat, index) => (
                <div key={stat.key} className="flex flex-col justify-center rounded-lg p-2 sm:p-3 md:p-4">
                  <p className="text-muted-foreground text-lg sm:text-xl md:text-2xl lg:text-3xl">
                    {stat.data.total.toLocaleString()}
                  </p>
                  <p className="text-muted-foreground mt-0.5 text-[10px] sm:mt-1 sm:text-xs">+{stat.data.change}</p>
                  <p className="text-muted-foreground mt-0.5 text-[9px] leading-tight sm:mt-1 sm:text-[10px] md:text-xs">
                    {stat.data.label}
                  </p>
                  <p className="text-stroke-1 text-muted mt-1.5 text-xs font-bold tracking-wider sm:mt-2 sm:text-sm md:text-base lg:text-lg">
                    {config.titles[index]}
                  </p>
                </div>
              ));
            })()}
          </div>
        </section>
      </div>

      {/* Bottom Section: Gender & Age Group */}
      <section className="flex min-h-[400px] flex-col gap-3 sm:min-h-[350px] sm:gap-4 md:h-80 md:gap-6">
        <Subtitle className="text-sm sm:text-base">Gender & Age Group</Subtitle>
        <div className="flex min-h-[360px] flex-col gap-4 sm:min-h-[300px] sm:flex-row sm:gap-4 md:h-full md:gap-8">
          {/* Gender Donut Chart */}
          <div className="flex w-full shrink-0 flex-col items-center justify-center gap-3 sm:w-[280px] md:w-[300px]">
            <div className="h-[200px] w-full sm:h-[220px] md:h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                    className="sm:innerRadius-[50px] sm:outerRadius-[70px] md:innerRadius-[60px] md:outerRadius-[80px]"
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-2 sm:gap-3 md:gap-4">
              {genderData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-1.5 sm:gap-2">
                  <div
                    className="h-2.5 w-2.5 rounded sm:h-3 sm:w-3"
                    style={{ backgroundColor: COLORS[index] ?? COLORS[0] }}
                  />
                  <span className="text-xs font-medium sm:text-sm">{entry.name}</span>
                  <span className="text-muted-foreground text-xs sm:text-sm">{entry.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Age Bar Chart */}
          <div className="flex h-[200px] w-full grow items-center justify-center sm:h-auto sm:min-h-[220px] md:min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageData} margin={{ top: 20, right: 10, left: 10, bottom: 5 }} className="sm:top-[20px]">
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9 }}
                  className="sm:text-[10px]"
                />
                <Bar
                  dataKey="value"
                  fill="var(--chart-1)"
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                  className="sm:barSize-[25px]"
                  label={{
                    position: "top",
                    fill: "hsl(var(--muted-foreground))",
                    fontSize: 10,
                    className: "sm:text-[12px]",
                    formatter: (value: number) => formatNumberShort(value),
                  }}
                >
                  {ageData.map((entry, index) => (
                    <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
}
