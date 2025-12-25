import { NextResponse } from "next/server";

import { mockTransactions } from "@/data/transactions";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const paymentMethod = searchParams.get("paymentMethod");
  const refundStatus = searchParams.get("refundStatus");
  const subCategory = searchParams.get("subCategory");
  const search = searchParams.get("search")?.trim();
  const types = searchParams.get("types")?.trim();
  const paymentMethods = searchParams.get("paymentMethods")?.trim();
  const refundStatuses = searchParams.get("refundStatuses")?.trim();
  const date = searchParams.get("date")?.trim();
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

  if (types) {
    const typeArray = types.split(",");
    transactions = transactions.filter((t) => typeArray.includes(t.type));
  }

  if (paymentMethods) {
    const methodArray = paymentMethods.split(",");
    transactions = transactions.filter((t) => methodArray.includes(t.paymentMethod));
  }

  if (refundStatuses) {
    const statusArray = refundStatuses.split(",");
    transactions = transactions.filter((t) => statusArray.includes(t.refundStatus ?? ""));
  }

  if (search) {
    const searchLower = search.toLowerCase();
    transactions = transactions.filter(
      (t) =>
        t.orderNumber.toLowerCase().includes(searchLower) ||
        t.from.toLowerCase().includes(searchLower) ||
        t.to.toLowerCase().includes(searchLower) ||
        t.productName.toLowerCase().includes(searchLower),
    );
  }

  if (date) {
    const dateStr = date;
    transactions = transactions.filter((t) => {
      const orderDate = new Date(t.orderDate);
      const orderDateStr = orderDate.toISOString().split("T")[0];
      return orderDateStr === dateStr;
    });
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
