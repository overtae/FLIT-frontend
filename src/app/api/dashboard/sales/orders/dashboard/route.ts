import { NextResponse } from "next/server";

import { generateOrderDashboardData } from "@/data/sales";

export async function GET() {
  try {
    const data = generateOrderDashboardData();

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch order dashboard data" }, { status: 500 });
  }
}
