import { NextResponse } from "next/server";

import { generateConversionRateData } from "@/data/sales";

export async function GET() {
  try {
    const data = generateConversionRateData();

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch conversion rate data" }, { status: 500 });
  }
}
