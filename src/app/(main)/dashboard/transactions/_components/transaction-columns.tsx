"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Download } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { Transaction } from "./transaction-types";

interface CreateColumnsProps {
  onViewDetail: (transaction: Transaction) => void;
  onDownload: (transaction: Transaction) => void;
  category?: "order" | "order-request" | "canceled";
}

export function createTransactionColumns({
  onViewDetail,
  onDownload,
  category = "order",
}: CreateColumnsProps): ColumnDef<Transaction>[] {
  const baseColumns: ColumnDef<Transaction>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllRowsSelected()}
          onCheckedChange={() => {
            if (table.getIsAllRowsSelected()) {
              table.toggleAllRowsSelected(false);
            } else {
              table.toggleAllRowsSelected(true);
            }
          }}
          aria-label="전체 선택"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="행 선택"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "orderNumber",
      header: "주문번호",
    },
    {
      accessorKey: "from",
      header: "From",
    },
    {
      accessorKey: "to",
      header: "To",
    },
    {
      accessorKey: "productName",
      header: "상품명",
    },
    {
      accessorKey: "paymentAmount",
      header: "결제금액",
      cell: ({ row }) => {
        const amount = row.original.paymentAmount;
        return <span>{amount.toLocaleString()}원</span>;
      },
    },
    {
      accessorKey: "orderDate",
      header: "주문접수일",
    },
    {
      accessorKey: "paymentDate",
      header: "결제일",
    },
  ];

  if (category === "canceled") {
    baseColumns.push({
      accessorKey: "refundStatus",
      header: "상태",
      cell: ({ row }) => {
        const status = row.original.refundStatus;
        return <Badge variant="outline">{status ?? ""}</Badge>;
      },
    });
  } else {
    if (category !== "order-request") {
      baseColumns.push({
        accessorKey: "paymentMethod",
        header: "결제방법",
        cell: ({ row }) => {
          const method = row.original.paymentMethod;
          return <Badge variant="outline">{method}</Badge>;
        },
      });
    }
    if (category === "order") {
      baseColumns.push({
        accessorKey: "type",
        header: "구분",
        cell: ({ row }) => {
          const type = row.original.type;
          return <Badge variant="secondary">{type}</Badge>;
        },
      });
    }
  }

  baseColumns.push({
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const transaction = row.original;

      return (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => onDownload(transaction)} className="h-8 w-8 p-0">
            <Download className="h-4 w-4" />
            <span className="sr-only">다운로드</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetail(transaction)}
            className="h-8 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            Detail
          </Button>
        </div>
      );
    },
  });

  return baseColumns;
}
