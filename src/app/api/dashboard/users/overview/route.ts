import { NextResponse } from "next/server";

import { mockUsers } from "@/data/users";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  const totalUserData = [
    { date: "10-01", count: 2000 },
    { date: "10-05", count: 2500 },
    { date: "10-10", count: 3200 },
    { date: "10-15", count: 3000 },
    { date: "10-20", count: 4000 },
    { date: "10-25", count: 4800 },
    { date: "10-30", count: 5200 },
  ];

  const genderData = [
    { name: "여성", value: 60 },
    { name: "남성", value: 35 },
    { name: "기타", value: 5 },
  ];

  const ageData = [
    { name: "10대", value: 120 },
    { name: "20대", value: 450 },
    { name: "30대", value: 380 },
    { name: "40대", value: 220 },
    { name: "50대", value: 150 },
    { name: "60대", value: 80 },
    { name: "70대+", value: 40 },
  ];

  let filteredUsers = mockUsers;
  if (category && category !== "all") {
    filteredUsers = mockUsers.filter((user) => user.category === category);
  }

  const customerCount = filteredUsers.filter((user) => user.category === "customer").length;
  const shopCount = filteredUsers.filter((user) => user.category === "shop").length;
  const floristCount = filteredUsers.filter((user) => user.category === "florist").length;
  const secederCount = filteredUsers.filter((user) => user.category === "seceder").length;

  const quickStats = {
    customer: {
      total: customerCount,
      change: 145,
      label: "전체 고객 수",
    },
    store: {
      total: shopCount,
      change: 14,
      label: "전체 꽃집 수",
    },
    florist: {
      total: floristCount,
      change: 13,
      label: "전체 플로리스트 수",
    },
    out: {
      total: secederCount,
      change: 13,
      label: "탈퇴 회원 수",
    },
  };

  return NextResponse.json({
    totalUserData,
    genderData,
    ageData,
    quickStats,
  });
}
