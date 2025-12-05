"use client";

import Link from "next/link";

import { ChevronDown, CircleUser, LogOut } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/lib/api/auth";

export function AccountDropdown({
  user,
}: {
  readonly user: {
    readonly name: string;
    readonly email: string;
  };
}) {
  const handleLogout = async () => {
    await signOut();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="hover:bg-accent flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus:outline-none">
          <span>{user.name} 님</span>
          <ChevronDown className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-48 rounded-lg" side="bottom" align="end" sideOffset={4}>
        <DropdownMenuItem className="cursor-pointer">
          <Link href="/dashboard/profile" className="flex gap-2">
            <CircleUser />
            정보 수정
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          <LogOut />
          로그아웃
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
