import { NextResponse } from "next/server";

import { mockTransactions } from "@/data/transactions";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const paymentMethod = searchParams.get("paymentMethod");
  const refundStatus = searchParams.get("refundStatus");
  const subCategory = searchParams.get("subCategory");
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") ?? "10", 10);

  let transactions = mockTransactions;

  if (type) {
    transactions = transactions.filter((t) => t.type === type);
  }

  if (paymentMethod) {
    transactions = transactions.filter((t) => t.paymentMethod === paymentMethod);
  }

  if (refundStatus) {
    transactions = transactions.filter((t) => t.refundStatus === refundStatus);
  }

  if (subCategory) {
    transactions = transactions.filter((t) => t.subCategory === subCategory);
  }

  const total = transactions.length;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedTransactions = transactions.slice(startIndex, endIndex);

  return NextResponse.json({
    data: paginatedTransactions,
    total,
    page,
    pageSize,
  });
}
