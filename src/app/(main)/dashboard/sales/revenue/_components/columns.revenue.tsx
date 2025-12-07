import { ColumnDef } from "@tanstack/react-table";
import { Download } from "lucide-react";
import z from "zod";

import { revenueSchema } from "@/app/(main)/dashboard/sales/revenue/_components/schema";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export const revenueColumns: ColumnDef<z.infer<typeof revenueSchema>>[] = [
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
    cell: ({ row }) => `${row.original.nickname} (${row.original.nicknameId})`,
  },
  {
    accessorKey: "phone",
    header: "번호",
  },
  {
    accessorKey: "address",
    header: "주소",
  },
  {
    id: "revenue",
    header: "매출액(건수)",
    cell: ({ row }) => `${row.original.revenueAmount.toLocaleString()}원 (${row.original.revenueCount}건)`,
  },
  {
    id: "cancel",
    header: "취소금액 (건수)",
    cell: ({ row }) => `${row.original.cancelAmount.toLocaleString()}원 (${row.original.cancelCount}건)`,
  },
  {
    id: "refund",
    header: "환불금액 (건수)",
    cell: ({ row }) => `${row.original.refundAmount.toLocaleString()}원 (${row.original.refundCount}건)`,
  },
  {
    id: "download",
    header: "다운로드",
    cell: () => {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
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
