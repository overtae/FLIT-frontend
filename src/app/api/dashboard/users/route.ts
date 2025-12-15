import { NextResponse } from "next/server";

import { mockUsers } from "@/data/users";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") ?? "10", 10);

  let users = mockUsers;

  if (category && category !== "all") {
    users = mockUsers.filter((user) => user.category === category);
  }

  const total = users.length;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedUsers = users.slice(startIndex, endIndex);

  return NextResponse.json({
    data: paginatedUsers,
    total,
    page,
    pageSize,
  });
}
