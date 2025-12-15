import { NextResponse } from "next/server";

import { mockSettlements } from "@/data/settlements";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const type = searchParams.get("type");
  const settlementDate = searchParams.get("settlementDate");
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") ?? "10", 10);

  let settlements = mockSettlements;

  if (status) {
    settlements = settlements.filter((s) => s.status === status);
  }

  if (type) {
    settlements = settlements.filter((s) => s.type === type);
  }

  if (settlementDate) {
    settlements = settlements.filter((s) => s.settlementDate === settlementDate);
  }

  const total = settlements.length;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedSettlements = settlements.slice(startIndex, endIndex);

  return NextResponse.json({
    data: paginatedSettlements,
    total,
    page,
    pageSize,
  });
}
