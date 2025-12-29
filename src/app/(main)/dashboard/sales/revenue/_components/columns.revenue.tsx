import { ColumnDef } from "@tanstack/react-table";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { RevenueDetailItem } from "@/types/sales.type";

export const revenueColumns: ColumnDef<RevenueDetailItem>[] = [
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
    cell: ({ row }) => `${row.original.nickname} (${row.original.loginId})`,
  },
  {
    accessorKey: "phoneNumber",
    header: "번호",
  },
  {
    accessorKey: "address",
    header: "주소",
  },
  {
    id: "salesAmount",
    header: "매출액",
    cell: ({ row }) => `${row.original.salesAmount.toLocaleString()}원`,
  },
  {
    id: "canceledAmount",
    header: "취소금액",
    cell: ({ row }) => `${row.original.canceledAmount.toLocaleString()}원`,
  },
  {
    id: "refundAmount",
    header: "환불금액",
    cell: ({ row }) => `${row.original.refundAmount.toLocaleString()}원`,
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
