"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Download } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SERVICE_CONFIG } from "@/config/service-config";
import type { Settlement, SettlementStatus } from "@/types/settlement.type";

const statusLabels: Record<SettlementStatus, string> = {
  PENDING: "대기중",
  COMPLETED: "완료",
  CANCELED: "취소",
};

const statusColors: Record<SettlementStatus, "default" | "secondary" | "destructive"> = {
  PENDING: "default",
  COMPLETED: "secondary",
  CANCELED: "destructive",
};

const getStatusLabel = (status: SettlementStatus): string => {
  return statusLabels[status] ?? status;
};

const getStatusVariant = (status: SettlementStatus): "default" | "secondary" | "destructive" => {
  return statusColors[status] ?? "default";
};

interface CreateSettlementColumnsProps {
  onDownload: (settlement: Settlement) => void;
}

export function createSettlementColumns({ onDownload }: CreateSettlementColumnsProps): ColumnDef<Settlement>[] {
  return [
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
      accessorKey: "nickname",
      header: "닉네임(ID)",
      cell: ({ row }) => {
        const settlement = row.original;
        return (
          <span>
            {settlement.nickname} ({settlement.loginId})
          </span>
        );
      },
    },
    {
      accessorKey: "phoneNumber",
      header: "번호",
    },
    {
      accessorKey: "mail",
      header: "mail",
    },
    {
      accessorKey: "totalSales",
      header: "총매출",
      cell: ({ row }) => {
        const amount = row.original.totalSales;
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
      id: "revenueExcludingCommission",
      header: "수수료 제외",
      cell: ({ row }) => {
        const amount = row.original.totalSales - row.original.commission;
        return <span>{amount.toLocaleString()}원</span>;
      },
    },
    {
      accessorKey: "deliveryAmount",
      header: "배달료",
      cell: ({ row }) => {
        const amount = row.original.deliveryAmount;
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
