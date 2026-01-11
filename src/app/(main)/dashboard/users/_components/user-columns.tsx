"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils";
import type { User } from "@/types/user.type";

export const getUserColumns = (onViewDetail: (user: User) => void, category?: string): ColumnDef<User>[] => [
  {
    accessorKey: "grade",
    header: "등급",
    cell: ({ row }) => {
      const grade: string = row.getValue("grade") || "";
      let variant: "default" | "secondary" | "destructive" | "outline" = "outline";

      if (["VIP", "Gold", "Red"].includes(grade)) variant = "destructive";
      else if (["Silver", "Yellow", "Orange"].includes(grade)) variant = "secondary";
      else variant = "outline";

      return (
        <Badge variant={variant} className="font-normal">
          {grade}
        </Badge>
      );
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
            <AvatarImage src={user.profileImageUrl} />
            <AvatarFallback className="bg-gray-100 text-[10px] text-gray-500">{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{user.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "nickname",
    header: "닉네임(ID)",
    cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.getValue("nickname")}</span>,
  },
  {
    accessorKey: "mail",
    header: "Mail",
    cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.getValue("mail")}</span>,
  },
  {
    accessorKey: "address",
    header: "주소",
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-[200px] truncate text-sm" title={row.getValue("address")}>
        {row.getValue("address")}
      </div>
    ),
  },
  {
    accessorKey: "phoneNumber",
    header: "대표번호",
    cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.getValue("phoneNumber")}</span>,
  },
  {
    accessorKey: "lastLoginDate",
    header: "Latest",
    cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.getValue("lastLoginDate") ?? "-"}</span>,
  },
  {
    id: "date",
    header: category === "seceder" ? "탈퇴일자" : "가입일자",
    cell: ({ row }) => {
      const user = row.original;
      const isSeceder = !!user.secedeDate;
      return <span className="text-muted-foreground text-sm">{isSeceder ? user.secedeDate : user.joinDate}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-7 rounded-full border-gray-200 px-3 text-xs text-gray-500 hover:bg-gray-50"
            onClick={() => onViewDetail(user)}
          >
            Detail
          </Button>
        </div>
      );
    },
  },
];
