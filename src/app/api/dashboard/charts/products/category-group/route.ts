import { NextResponse } from "next/server";

import { categoryGroupData, categoryProductData } from "@/data/charts";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const viewMode = searchParams.get("viewMode") ?? "group";

  if (viewMode === "product") {
    return NextResponse.json(categoryProductData);
  }

  return NextResponse.json(categoryGroupData);
}
