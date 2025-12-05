"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Download } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export type Settlement = {
  id: string;
  nickname: string;
  nicknameId: string;
  phone: string;
  email: string;
  totalRevenue: number;
  commission: number;
  revenueExcludingCommission: number;
  deliveryFee: number;
  status: "pending" | "completed" | "cancelled";
  settlementDate: string;
  type: "shop" | "florist";
};

const statusLabels: Record<Settlement["status"], string> = {
  pending: "대기중",
  completed: "완료",
  cancelled: "취소",
};

const statusColors: Record<Settlement["status"], "default" | "secondary" | "destructive"> = {
  pending: "default",
  completed: "secondary",
  cancelled: "destructive",
};

const getStatusLabel = (status: Settlement["status"]): string => {
  switch (status) {
    case "pending":
      return statusLabels.pending;
    case "completed":
      return statusLabels.completed;
    case "cancelled":
      return statusLabels.cancelled;
    default:
      return status;
  }
};

const getStatusVariant = (status: Settlement["status"]): "default" | "secondary" | "destructive" => {
  switch (status) {
    case "pending":
      return statusColors.pending;
    case "completed":
      return statusColors.completed;
    case "cancelled":
      return statusColors.cancelled;
    default:
      return "default";
  }
};

interface CreateSettlementColumnsProps {
  onDownload: (settlement: Settlement) => void;
}

export function createSettlementColumns({ onDownload }: CreateSettlementColumnsProps): ColumnDef<Settlement>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <div
          className="flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => {
              table.toggleAllPageRowsSelected(!!value);
            }}
            onClick={(e) => e.stopPropagation()}
            aria-label="전체 선택"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div
          className="flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => {
              row.toggleSelected(!!value);
            }}
            onClick={(e) => e.stopPropagation()}
            aria-label="행 선택"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "nickname",
      header: "닉네임(ID)",
      cell: ({ row }) => {
        const settlement = row.original;
        return (
          <span>
            {settlement.nickname} ({settlement.nicknameId})
          </span>
        );
      },
    },
    {
      accessorKey: "phone",
      header: "번호",
    },
    {
      accessorKey: "email",
      header: "mail",
    },
    {
      accessorKey: "totalRevenue",
      header: "총매출",
      cell: ({ row }) => {
        const amount = row.original.totalRevenue;
        return <span>{amount.toLocaleString()}원</span>;
      },
    },
    {
      accessorKey: "commission",
      header: "수수료",
      cell: ({ row }) => {
        const amount = row.original.commission;
        return <span>{amount.toLocaleString()}원</span>;
      },
    },
    {
      accessorKey: "revenueExcludingCommission",
      header: "수수료 제외",
      cell: ({ row }) => {
        const amount = row.original.revenueExcludingCommission;
        return <span>{amount.toLocaleString()}원</span>;
      },
    },
    {
      accessorKey: "deliveryFee",
      header: "배달료",
      cell: ({ row }) => {
        const amount = row.original.deliveryFee;
        return <span>{amount.toLocaleString()}원</span>;
      },
    },
    {
      accessorKey: "status",
      header: "상태",
      cell: ({ row }) => {
        const status = row.original.status;
        return <Badge variant={getStatusVariant(status)}>{getStatusLabel(status)}</Badge>;
      },
    },
    {
      id: "download",
      header: "다운로드",
      cell: ({ row }) => {
        const settlement = row.original;
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDownload(settlement);
            }}
            className="h-8 w-8 p-0"
          >
            <Download className="h-4 w-4" />
            <span className="sr-only">다운로드</span>
          </Button>
        );
      },
    },
  ];
}
