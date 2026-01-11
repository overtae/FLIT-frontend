"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SERVICE_CONFIG } from "@/config/service-config";
import type { Transaction } from "@/types/transaction.type";

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
      accessorKey: "transactionNumber",
      header: "주문번호",
      cell: ({ row }) => <span className="text-xs break-words sm:text-sm">{row.getValue("transactionNumber")}</span>,
    },
    {
      accessorKey: "fromNickname",
      header: "From",
      cell: ({ row }) => <span className="text-xs break-words sm:text-sm">{row.getValue("fromNickname")}</span>,
    },
    {
      accessorKey: "toNickname",
      header: "To",
      cell: ({ row }) => <span className="text-xs break-words sm:text-sm">{row.getValue("toNickname")}</span>,
    },
    {
      accessorKey: "productName",
      header: "상품명",
      cell: ({ row }) => <span className="text-xs break-words sm:text-sm">{row.getValue("productName")}</span>,
    },
    {
      accessorKey: "paymentAmount",
      header: "결제금액",
      cell: ({ row }) => {
        const amount = row.original.paymentAmount;
        return <span className="text-xs sm:text-sm">{amount.toLocaleString()}원</span>;
      },
    },
    {
      accessorKey: "orderDate",
      header: "주문접수일",
      cell: ({ row }) => <span className="text-xs sm:text-sm">{row.getValue("orderDate")}</span>,
    },
    {
      accessorKey: "paymentDate",
      header: "결제일",
      cell: ({ row }) => <span className="text-xs sm:text-sm">{row.getValue("paymentDate")}</span>,
    },
  ];

  if (category === "canceled") {
    baseColumns.push({
      accessorKey: "status",
      header: "상태",
      cell: ({ row }) => {
        if ("status" in row.original) {
          const statusKey = row.original.status as keyof typeof SERVICE_CONFIG.refundStatus;
          const statusLabel = SERVICE_CONFIG.refundStatus[statusKey];
          return <Badge variant="outline">{statusLabel}</Badge>;
        }
        return null;
      },
    });
  } else {
    if (category !== "order-request") {
      baseColumns.push({
        accessorKey: "paymentMethod",
        header: "결제방법",
        cell: ({ row }) => {
          if (row.original.paymentMethod) {
            const methodKey = row.original.paymentMethod as keyof typeof SERVICE_CONFIG.paymentMethod;
            const methodLabel = SERVICE_CONFIG.paymentMethod[methodKey];
            return <Badge variant="outline">{methodLabel}</Badge>;
          }
          return null;
        },
      });
    }
    if (category === "order") {
      baseColumns.push({
        accessorKey: "type",
        header: "구분",
        cell: ({ row }) => {
          if (row.original.type) {
            const typeKey = row.original.type as keyof typeof SERVICE_CONFIG.transactionType;
            const typeLabel = SERVICE_CONFIG.transactionType[typeKey];
            return <Badge variant="secondary">{typeLabel}</Badge>;
          }
          return null;
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
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetail(transaction)}
            className="hover:bg-main/5 hover:text-main hover:border-main h-6 rounded-full px-2 text-[10px] sm:h-7 sm:px-3 sm:text-xs"
          >
            Detail
          </Button>
        </div>
      );
    },
  });

  return baseColumns;
}
