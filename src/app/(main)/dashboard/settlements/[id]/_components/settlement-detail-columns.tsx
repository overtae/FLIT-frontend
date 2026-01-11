"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SERVICE_CONFIG } from "@/config/service-config";
import type { SettlementDetail } from "@/types/settlement.type";

type SettlementDetailTransaction = SettlementDetail["transactions"][0];

interface CreateSettlementDetailColumnsProps {
  onViewDetail: (transaction: SettlementDetailTransaction) => void;
}

export function createSettlementDetailColumns({
  onViewDetail,
}: CreateSettlementDetailColumnsProps): ColumnDef<SettlementDetailTransaction>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="전체 선택"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="행 선택"
          />
        </div>
      ),
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
    {
      accessorKey: "paymentMethod",
      header: "결제방법",
      cell: ({ row }) => {
        const method = row.original.paymentMethod;
        const methodLabel =
          Object.entries(SERVICE_CONFIG.paymentMethod).find(([key]) => key === method.toUpperCase())?.[1] ?? method;
        return <Badge variant="outline">{methodLabel}</Badge>;
      },
    },
    {
      accessorKey: "type",
      header: "구분",
      cell: ({ row }) => {
        const type = row.original.type;
        const typeLabel =
          Object.entries(SERVICE_CONFIG.transactionType).find(([key]) => key === type.toUpperCase())?.[1] ?? type;
        return <Badge variant="secondary">{typeLabel}</Badge>;
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetail(transaction);
            }}
            className="hover:bg-main/5 hover:border-main hover:text-main h-6 rounded-full px-2 text-[10px] sm:h-7 sm:px-3 sm:text-xs"
          >
            Detail
          </Button>
        );
      },
    },
  ];
}
