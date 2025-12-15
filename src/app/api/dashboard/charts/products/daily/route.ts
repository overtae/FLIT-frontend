import { NextResponse } from "next/server";

import { productDailyRevenue } from "@/data/charts";

export async function GET() {
  return NextResponse.json(productDailyRevenue);
}
