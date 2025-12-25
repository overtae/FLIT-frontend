import { NextResponse } from "next/server";

export async function GET() {
  try {
    // TODO: 실제 데이터로 교체 필요
    const data = [
      { rank: 1, keyword: "장미", search: 1250, bounceRate: 25.5 },
      { rank: 2, keyword: "화분", search: 980, bounceRate: 30.2 },
      { rank: 3, keyword: "꽃다발", search: 850, bounceRate: 28.1 },
      { rank: 4, keyword: "식물", search: 720, bounceRate: 32.5 },
      { rank: 5, keyword: "화환", search: 650, bounceRate: 27.8 },
      { rank: 6, keyword: "다육식물", search: 580, bounceRate: 29.3 },
      { rank: 7, keyword: "공기정화", search: 520, bounceRate: 26.7 },
      { rank: 8, keyword: "플랜테리어", search: 480, bounceRate: 31.2 },
      { rank: 9, keyword: "가드닝", search: 420, bounceRate: 28.9 },
      { rank: 10, keyword: "정기배송", search: 380, bounceRate: 27.4 },
    ];

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch search trend data" }, { status: 500 });
  }
}
