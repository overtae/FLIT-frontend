import { NextRequest, NextResponse } from "next/server";

import { generateSettlementsMonthly } from "@/data/settlements-monthly";
import { SettlementMonthlyResponse } from "@/types/settlements-monthly";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const year = parseInt(searchParams.get("year") ?? new Date().getFullYear().toString(), 10);
  const month = parseInt(searchParams.get("month") ?? (new Date().getMonth() + 1).toString(), 10);
  const period = searchParams.get("period") as "1week" | "2week" | "month" | null;
  const type = searchParams.get("type") as "shop" | "florist" | null;
  const date = searchParams.get("date");
  const nickname = searchParams.get("nickname");
  const status = searchParams.get("status") as "pending" | "completed" | "cancelled" | null;
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") ?? "10", 10);

  let monthlyData = generateSettlementsMonthly(year, month);

  if (type) {
    monthlyData = monthlyData.map((dateData) => ({
      ...dateData,
      items: dateData.items.filter((item) => item.type === type),
    }));
  }

  if (status) {
    monthlyData = monthlyData.map((dateData) => ({
      ...dateData,
      items: dateData.items.filter((item) => item.status === status),
    }));
  }

  if (nickname) {
    const searchLower = nickname.toLowerCase();
    monthlyData = monthlyData.map((dateData) => ({
      ...dateData,
      items: dateData.items.filter(
        (item) =>
          item.nickname.toLowerCase().includes(searchLower) || item.nicknameId.toLowerCase().includes(searchLower),
      ),
    }));
  }

  if (date) {
    monthlyData = monthlyData.filter((dateData) => dateData.date === date);
  }

  // period가 없으면 전체 월 데이터를 반환
  if (period) {
    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    if (period === "1week") {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      weekStart.setHours(0, 0, 0, 0);
      startDate = weekStart;
      endDate = new Date(weekStart);
      endDate.setDate(weekStart.getDate() + 6);
    } else if (period === "2week") {
      const twoWeeksAgo = new Date(now);
      twoWeeksAgo.setDate(now.getDate() - 14);
      twoWeeksAgo.setHours(0, 0, 0, 0);
      startDate = twoWeeksAgo;
      endDate = new Date(now);
    } else {
      startDate = new Date(year, month - 1, 1);
      endDate = new Date(year, month, 0);
    }

    monthlyData = monthlyData.filter((dateData) => {
      const dataDate = new Date(dateData.date);
      return dataDate >= startDate && dataDate <= endDate;
    });
  } else {
    // period가 없으면 해당 월의 전체 데이터를 반환
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    monthlyData = monthlyData.filter((dateData) => {
      const dataDate = new Date(dateData.date);
      return dataDate >= startDate && dataDate <= endDate;
    });
  }

  monthlyData = monthlyData.filter((dateData) => dateData.items.length > 0);

  if (date) {
    const selectedDateData = monthlyData.find((d) => d.date === date);
    if (selectedDateData) {
      const total = selectedDateData.items.length;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedItems = selectedDateData.items.slice(startIndex, endIndex);

      const response: SettlementMonthlyResponse = {
        data: [
          {
            date: selectedDateData.date,
            items: paginatedItems,
          },
        ],
        total,
        page,
        pageSize,
      };

      return NextResponse.json(response);
    } else {
      const response: SettlementMonthlyResponse = {
        data: [],
        total: 0,
        page,
        pageSize,
      };

      return NextResponse.json(response);
    }
  }

  if (pageSize >= 1000) {
    const total = monthlyData.reduce((sum, dateData) => sum + dateData.items.length, 0);
    const response: SettlementMonthlyResponse = {
      data: monthlyData,
      total,
      page: 1,
      pageSize: total,
    };

    return NextResponse.json(response);
  }

  const total = monthlyData.reduce((sum, dateData) => sum + dateData.items.length, 0);
  const allItems = monthlyData.flatMap((dateData) => dateData.items);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedItems = allItems.slice(startIndex, endIndex);

  const itemsByDate = new Map<string, typeof paginatedItems>();
  paginatedItems.forEach((item) => {
    const date = item.settlementDate;
    if (!itemsByDate.has(date)) {
      itemsByDate.set(date, []);
    }
    itemsByDate.get(date)!.push(item);
  });

  const paginatedData = Array.from(itemsByDate.entries()).map(([date, items]) => ({
    date,
    items,
  }));

  const response: SettlementMonthlyResponse = {
    data: paginatedData,
    total,
    page,
    pageSize,
  };

  return NextResponse.json(response);
}
