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

import { transactionColumns, Transaction } from "./transaction-columns";

const mockTransactions: Transaction[] = [
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    from: "매장A",
    to: "고객B",
    productName: "장미 꽃다발",
    paymentAmount: 50000,
    orderDate: "2024-01-15",
    paymentDate: "2024-01-15",
    paymentMethod: "card",
    category: "order",
  },
  {
    id: "2",
    orderNumber: "ORD-2024-002",
    from: "플로리스트C",
    to: "매장D",
    productName: "화분 식물",
    paymentAmount: 30000,
    orderDate: "2024-01-14",
    paymentDate: "2024-01-14",
    paymentMethod: "transfer",
    category: "order-request",
  },
];

interface TransactionListProps {
  category?: string;
  subCategory?: string;
}

export function TransactionList({ category, subCategory }: TransactionListProps) {
  const [data] = useState<Transaction[]>(() => {
    let filtered = mockTransactions;
    if (category) {
      filtered = filtered.filter((t) => t.category === category);
    }
    return filtered;
  });
  const [search, setSearch] = useState("");

  const table = useDataTableInstance({
    data,
    columns: transactionColumns,
    getRowId: (row) => row.id,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>거래 목록</CardTitle>
        <CardDescription>
          주문번호, from, to, 상품명+이미지, 결제금액, 주문접수일, 결제일, 결제방법, 구분
        </CardDescription>
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
          <DataTable table={table} columns={transactionColumns} />
        </div>
        <DataTablePagination table={table} />
      </CardContent>
    </Card>
  );
}
