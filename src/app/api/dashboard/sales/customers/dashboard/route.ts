import { NextResponse } from "next/server";

import { generateCustomerDashboardData } from "@/data/sales";

export async function GET() {
  try {
    const data = generateCustomerDashboardData();

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch customer dashboard data" }, { status: 500 });
  }
}
