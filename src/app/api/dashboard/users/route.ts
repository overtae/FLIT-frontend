import { NextResponse } from "next/server";

import { mockUsers } from "@/data/users";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category")?.trim();
  const search = searchParams.get("search")?.trim();
  const grades = searchParams.get("grades")?.trim();
  const date = searchParams.get("date")?.trim();
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") ?? "10", 10);

  let users = [...mockUsers];

  if (category && category !== "all") {
    users = users.filter((user) => user.category === category);
  }

  if (search) {
    const searchLower = search.toLowerCase();
    users = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchLower) ||
        user.nickname.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.phone.includes(search) ||
        user.address.toLowerCase().includes(searchLower),
    );
  }

  if (grades) {
    const gradeArray = grades.split(",");
    users = users.filter((user) => gradeArray.includes(user.grade));
  }

  if (date) {
    const dateStr = date;
    users = users.filter((user) => {
      // Filter by joinDate or lastAccessDate
      const joinDateStr = user.joinDate.replace(/\./g, "-");
      const lastAccessDateStr = user.lastAccessDate.replace(/\./g, "-");
      return joinDateStr === dateStr || lastAccessDateStr === dateStr;
    });
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
