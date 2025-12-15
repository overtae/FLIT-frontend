import { NextResponse } from "next/server";

import { visitorsChartData } from "@/data/charts";

export async function GET() {
  return NextResponse.json(visitorsChartData);
}
