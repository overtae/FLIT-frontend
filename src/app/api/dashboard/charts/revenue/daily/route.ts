import { NextResponse } from "next/server";

import { revenueDailyData } from "@/data/charts";

export async function GET() {
  return NextResponse.json(revenueDailyData);
}
