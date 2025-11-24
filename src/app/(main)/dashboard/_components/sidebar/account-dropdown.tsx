"use client";

import { ChevronDown, LogOut, UserPen } from "lucide-react";

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

  const handleEditProfile = () => {
    console.log("정보 수정");
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
        <DropdownMenuItem onClick={handleEditProfile}>
          <UserPen className="size-4" />
          정보 수정
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
          <LogOut className="size-4" />
          로그아웃
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
