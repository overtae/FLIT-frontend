import { NextResponse } from "next/server";

import { productYearlyData } from "@/data/charts";

export async function GET() {
  return NextResponse.json(productYearlyData);
}
