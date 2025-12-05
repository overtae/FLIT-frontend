"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Download } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export type SettlementDetailTransaction = {
  id: string;
  orderNumber: string;
  from: string;
  to: string;
  productName: string;
  paymentAmount: number;
  orderDate: string;
  paymentDate: string;
  paymentMethod: string;
  type: string;
};

interface CreateSettlementDetailColumnsProps {
  onDownload: (transaction: SettlementDetailTransaction) => void;
  onViewDetail: (transaction: SettlementDetailTransaction) => void;
}

export function createSettlementDetailColumns({
  onDownload,
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
    {
      accessorKey: "paymentMethod",
      header: "결제방법",
      cell: ({ row }) => {
        const method = row.original.paymentMethod;
        return <Badge variant="outline">{method}</Badge>;
      },
    },
    {
      accessorKey: "type",
      header: "구분",
      cell: ({ row }) => {
        const type = row.original.type;
        return <Badge variant="secondary">{type}</Badge>;
      },
    },
    {
      id: "download",
      header: "다운로드",
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDownload(transaction);
            }}
            className="h-8 w-8 p-0"
          >
            <Download className="h-4 w-4" />
            <span className="sr-only">다운로드</span>
          </Button>
        );
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
            className="h-8 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            Detail
          </Button>
        );
      },
    },
  ];
}
