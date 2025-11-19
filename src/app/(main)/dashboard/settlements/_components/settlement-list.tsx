"use client";

import { useState } from "react";

import { Download, Search, Filter, Calendar } from "lucide-react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";

import { settlementColumns, Settlement } from "./settlement-columns";

const mockSettlements: Settlement[] = [
  {
    id: "1",
    nickname: "매장A",
    phone: "010-1234-5678",
    email: "shop@example.com",
    totalRevenue: 1000000,
    commission: 100000,
    revenueExcludingCommission: 900000,
    deliveryFee: 50000,
    status: "completed",
    settlementDate: "2024-01-15",
  },
  {
    id: "2",
    nickname: "플로리스트B",
    phone: "010-2345-6789",
    email: "florist@example.com",
    totalRevenue: 800000,
    commission: 80000,
    revenueExcludingCommission: 720000,
    deliveryFee: 40000,
    status: "pending",
    settlementDate: "2024-01-20",
  },
];

export function SettlementList() {
  const [data] = useState<Settlement[]>(mockSettlements);
  const [search, setSearch] = useState("");

  const table = useDataTableInstance({
    data,
    columns: settlementColumns,
    getRowId: (row) => row.id,
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>정산 캘린더</CardTitle>
          <CardDescription>정산일, 오늘 날짜 표기</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>정산일: 매주 월요일</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>오늘: 2024-01-15</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>정산 목록</CardTitle>
          <CardDescription>닉네임, 번호, 메일, 총매출, 수수료, 수수료 제외, 배달료, 상태</CardDescription>
          <CardAction>
            <div className="flex items-center gap-2">
              <Select defaultValue="1week">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1week">1주</SelectItem>
                  <SelectItem value="2week">2주</SelectItem>
                  <SelectItem value="month">월</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="store">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="store">Store</SelectItem>
                  <SelectItem value="florist">Florist</SelectItem>
                </SelectContent>
              </Select>
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
            <DataTable table={table} columns={settlementColumns} />
          </div>
          <DataTablePagination table={table} />
        </CardContent>
      </Card>
    </div>
  );
}
