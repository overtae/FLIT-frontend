import { NextResponse } from "next/server";

import { mockSettlementDetail, mockSettlementDetailTransactions } from "@/data/settlements";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const detail = {
    ...mockSettlementDetail,
    id,
    settlementDate: mockSettlementDetail.settlementDate.toISOString(),
    lastUpdated: mockSettlementDetail.lastUpdated.toISOString(),
  };

  return NextResponse.json({
    detail,
    transactions: mockSettlementDetailTransactions,
  });
}
