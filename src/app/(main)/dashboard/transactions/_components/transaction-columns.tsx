"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Eye, Trash2, Download } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type Transaction = {
  id: string;
  orderNumber: string;
  from: string;
  to: string;
  productName: string;
  productImage?: string;
  paymentAmount: number;
  orderDate: string;
  paymentDate: string;
  paymentMethod: "card" | "transfer" | "pos";
  category: "order" | "order-request" | "canceled";
  subCategory?: string;
  refundStatus?: boolean;
};

const paymentMethodLabels: Record<Transaction["paymentMethod"], string> = {
  card: "카드",
  transfer: "계좌이체",
  pos: "POS 결제",
};

export const transactionColumns: ColumnDef<Transaction>[] = [
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
    cell: ({ row }) => {
      const transaction = row.original;
      return (
        <div className="flex items-center gap-2">
          {transaction.productImage && (
            <Avatar className="h-8 w-8">
              <AvatarImage src={transaction.productImage} />
              <AvatarFallback>상품</AvatarFallback>
            </Avatar>
          )}
          <span>{transaction.productName}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "paymentAmount",
    header: "결제금액",
    cell: ({ row }) => {
      const amount = row.getValue("paymentAmount");
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
      const method = row.getValue("paymentMethod");
      return <Badge variant="outline">{paymentMethodLabels[method]}</Badge>;
    },
  },
  {
    accessorKey: "category",
    header: "구분",
    cell: ({ row }) => {
      return <Badge variant="secondary">{row.getValue("category")}</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const transaction = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">메뉴 열기</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => console.log("상세보기", transaction.id)}>
              <Eye className="mr-2 h-4 w-4" />
              상세보기
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("엑셀 다운로드", transaction.id)}>
              <Download className="mr-2 h-4 w-4" />
              엑셀 다운로드
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("삭제", transaction.id)} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              삭제
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
