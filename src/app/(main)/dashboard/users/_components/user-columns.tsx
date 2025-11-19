"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Eye, Trash2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitials } from "@/lib/utils";

export type User = {
  id: string;
  category: "customer" | "shop" | "florist" | "seceder";
  grade: string;
  name: string;
  nickname: string;
  email: string;
  address: string;
  phone: string;
  lastAccessDate: string;
  joinDate: string;
};

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "grade",
    header: "등급",
    cell: ({ row }) => {
      const grade: string = row.getValue("grade");
      return <Badge variant="secondary">{grade}</Badge>;
    },
  },
  {
    accessorKey: "name",
    header: "이름",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={undefined} />
            <AvatarFallback className="text-xs">{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <span>{user.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "nickname",
    header: "닉네임(ID)",
  },
  {
    accessorKey: "email",
    header: "이메일",
  },
  {
    accessorKey: "address",
    header: "주소",
  },
  {
    accessorKey: "phone",
    header: "대표번호",
  },
  {
    accessorKey: "lastAccessDate",
    header: "최근접속일",
  },
  {
    accessorKey: "joinDate",
    header: "가입일자",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">메뉴 열기</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => console.log("상세보기", user.id)}>
              <Eye className="mr-2 h-4 w-4" />
              상세보기
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("삭제", user.id)} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              삭제
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
