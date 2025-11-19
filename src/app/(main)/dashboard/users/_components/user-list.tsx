"use client";

import { useState } from "react";

import { Download, Search, Filter } from "lucide-react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";

import { userColumns, User } from "./user-columns";

const mockUsers: User[] = [
  {
    id: "1",
    category: "customer",
    grade: "VIP",
    name: "홍길동",
    nickname: "hong123",
    email: "hong@example.com",
    address: "서울시 강남구",
    phone: "010-1234-5678",
    lastAccessDate: "2024-01-15",
    joinDate: "2023-01-01",
  },
  {
    id: "2",
    category: "shop",
    grade: "골드",
    name: "김상점",
    nickname: "shop123",
    email: "shop@example.com",
    address: "서울시 서초구",
    phone: "010-2345-6789",
    lastAccessDate: "2024-01-14",
    joinDate: "2023-02-01",
  },
  {
    id: "3",
    category: "florist",
    grade: "실버",
    name: "이플로리스트",
    nickname: "florist123",
    email: "florist@example.com",
    address: "서울시 마포구",
    phone: "010-3456-7890",
    lastAccessDate: "2024-01-13",
    joinDate: "2023-03-01",
  },
];

interface UserListProps {
  category?: string;
}

export function UserList({ category }: UserListProps) {
  const [data] = useState<User[]>(() => {
    if (category) {
      return mockUsers.filter((user) => user.category === category);
    }
    return mockUsers;
  });
  const [search, setSearch] = useState("");

  const table = useDataTableInstance({
    data,
    columns: userColumns,
    getRowId: (row) => row.id,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>유저 목록</CardTitle>
        <CardDescription>등급, 이름, 닉네임, 이메일, 주소, 대표번호, 최근접속일, 가입일자</CardDescription>
        <CardAction>
          <div className="flex items-center gap-2">
            <div className="relative max-w-sm flex-1">
              <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
              <Input
                placeholder="검색..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              필터
            </Button>
            <DataTableViewOptions table={table} />
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              엑셀 다운로드
            </Button>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="flex size-full flex-col gap-4">
        <div className="overflow-hidden rounded-md border">
          <DataTable table={table} columns={userColumns} />
        </div>
        <DataTablePagination table={table} />
      </CardContent>
    </Card>
  );
}
