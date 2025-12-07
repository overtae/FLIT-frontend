import type { ColumnDef } from "@tanstack/react-table";
import { Download } from "lucide-react";
import z from "zod";

import { productSchema } from "@/app/(main)/dashboard/sales/products/_components/schema";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export const productColumns: ColumnDef<z.infer<typeof productSchema>>[] = [
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
    accessorKey: "name",
    header: "이름",
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
    accessorKey: "productName",
    header: "상품명",
  },
  {
    accessorKey: "amount",
    header: "금액",
    cell: ({ row }) => `${row.original.amount.toLocaleString()}원`,
  },
  {
    accessorKey: "paymentMethod",
    header: "결제방법",
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
            // Download logic here
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
