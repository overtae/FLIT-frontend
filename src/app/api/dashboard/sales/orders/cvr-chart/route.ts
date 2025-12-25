import { NextResponse } from "next/server";

import { generateCvrChartData } from "@/data/sales";

export async function GET() {
  try {
    const data = generateCvrChartData();

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch CVR chart data" }, { status: 500 });
  }
}
