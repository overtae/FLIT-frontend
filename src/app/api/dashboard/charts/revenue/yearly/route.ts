import { NextResponse } from "next/server";

import { revenueYearlyData } from "@/data/charts";

export async function GET() {
  return NextResponse.json(revenueYearlyData);
}
