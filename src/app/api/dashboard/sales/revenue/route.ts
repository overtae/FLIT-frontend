import { NextResponse } from "next/server";

import { mockRevenueDetails } from "@/data/sales";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") ?? "10", 10);

  const total = mockRevenueDetails.length;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = mockRevenueDetails.slice(startIndex, endIndex);

  return NextResponse.json({
    data: paginatedData,
    total,
    page,
    pageSize,
  });
}
