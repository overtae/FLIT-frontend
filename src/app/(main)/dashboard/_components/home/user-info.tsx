"use client";

import Link from "next/link";

import { Bell, Settings, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getInitials } from "@/lib/utils";

interface UserInfoProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
    level?: string;
  };
}

export function UserInfo({ user }: UserInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>사용자 정보</CardTitle>
        <CardDescription>프로필 및 계정 관리</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold">{user.name}</h3>
            <p className="text-muted-foreground text-sm">{user.email}</p>
            {user.level && <p className="text-muted-foreground text-sm">레벨: {user.level}</p>}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" asChild>
            <Link href="/dashboard/profile">
              <Settings className="mr-2 size-4" />
              정보수정
            </Link>
          </Button>
          <Button variant="outline" className="flex-1">
            <Bell className="mr-2 size-4" />
            알림
          </Button>
          <Button variant="outline" className="flex-1">
            <LogOut className="mr-2 size-4" />
            로그아웃
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
