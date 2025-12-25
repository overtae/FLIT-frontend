import { NextRequest, NextResponse } from "next/server";

import {
  ageData,
  genderData,
  topItems,
  allItems,
  ageStackedBarData,
  genderStackedBarData,
} from "@/data/customer-analysis";
import { CustomerAnalysisResponse } from "@/types/customer-analysis";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const period = searchParams.get("period") ?? "last-month";

  const response: CustomerAnalysisResponse = {
    ageData: [...ageData],
    genderData: [...genderData],
    topItems: [...topItems],
    allItems: [...allItems],
    stackedBarData: period === "last-month" ? ageStackedBarData : genderStackedBarData,
  };

  return NextResponse.json(response);
}
