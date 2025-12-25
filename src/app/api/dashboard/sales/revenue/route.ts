import { NextResponse } from "next/server";

import { mockRevenueDetails } from "@/data/sales";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") ?? "10", 10);
  const search = searchParams.get("search")?.trim();

  let filteredData = [...mockRevenueDetails];

  if (search) {
    const searchLower = search.toLowerCase();
    filteredData = filteredData.filter(
      (item) =>
        item.nickname.toLowerCase().includes(searchLower) ||
        item.nicknameId.toLowerCase().includes(searchLower) ||
        item.phone.includes(search) ||
        item.address.toLowerCase().includes(searchLower),
    );
  }

  const total = filteredData.length;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  return NextResponse.json({
    data: paginatedData,
    total,
    page,
    pageSize,
  });
}
