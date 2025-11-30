"use client";

import { useState } from "react";

import { PasswordVerification } from "@/components/password-verification";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { UserList } from "./_components/user-list";
import { UserOverview } from "./_components/user-overview";

export default function UsersPage() {
  const [isVerified, setIsVerified] = useState(false);

  if (!isVerified) {
    return (
      <PasswordVerification
        title="비밀번호 재확인"
        description="유저관리에 접근하기 위해 비밀번호를 입력해주세요."
        onVerified={() => setIsVerified(true)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">유저관리</h1>
        <p className="text-muted-foreground mt-2">유저 정보를 관리하세요</p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="list">User List</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <UserOverview category="all" />
        </TabsContent>
        <TabsContent value="list" className="mt-6">
          <UserList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
