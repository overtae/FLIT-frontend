import { NextResponse } from "next/server";

import { productCategoryData } from "@/data/charts";

export async function GET() {
  return NextResponse.json(productCategoryData);
}
