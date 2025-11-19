"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Eye, Download } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type Settlement = {
  id: string;
  nickname: string;
  phone: string;
  email: string;
  totalRevenue: number;
  commission: number;
  revenueExcludingCommission: number;
  deliveryFee: number;
  status: "pending" | "completed" | "cancelled";
  settlementDate: string;
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

export const settlementColumns: ColumnDef<Settlement>[] = [
  {
    accessorKey: "nickname",
    header: "닉네임",
  },
  {
    accessorKey: "phone",
    header: "번호",
  },
  {
    accessorKey: "email",
    header: "메일",
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
    id: "actions",
    cell: ({ row }) => {
      const settlement = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">메뉴 열기</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => console.log("상세보기", settlement.id)}>
              <Eye className="mr-2 h-4 w-4" />
              상세보기
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("엑셀 다운로드", settlement.id)}>
              <Download className="mr-2 h-4 w-4" />
              엑셀 다운로드
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
