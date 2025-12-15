import { NextResponse } from "next/server";

import { mockDashboardSections } from "@/data/dashboard-sections";

export async function GET() {
  return NextResponse.json(mockDashboardSections);
}
