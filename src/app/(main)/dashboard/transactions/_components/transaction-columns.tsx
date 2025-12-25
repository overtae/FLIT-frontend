"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { Transaction } from "./transaction-types";

interface CreateColumnsProps {
  onViewDetail: (transaction: Transaction) => void;
  category?: "order" | "order-request" | "canceled";
}

export function createTransactionColumns({
  onViewDetail,
  category = "order",
}: CreateColumnsProps): ColumnDef<Transaction>[] {
  const baseColumns: ColumnDef<Transaction>[] = [
    {
      id: "select",
      header: ({ table }) => {
        const checked = table.getIsAllPageRowsSelected()
          ? true
          : table.getIsSomePageRowsSelected()
            ? "indeterminate"
            : false;

        return (
          <Checkbox
            checked={checked}
            onCheckedChange={(value) => {
              table.toggleAllPageRowsSelected(!!value);
            }}
            aria-label="Select all"
          />
        );
      },
      cell: ({ row }) => {
        const checked = row.getIsSelected();

        return (
          <Checkbox
            checked={checked}
            disabled={!row.getCanSelect()}
            onCheckedChange={(value) => {
              row.toggleSelected(!!value);
            }}
            onClick={(e) => e.stopPropagation()}
            aria-label="Select row"
          />
        );
      },
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetail(transaction)}
            className="hover:bg-main/5 hover:text-main hover:border-main rounded-full"
          >
            Detail
          </Button>
        </div>
      );
    },
  });

  return baseColumns;
}
