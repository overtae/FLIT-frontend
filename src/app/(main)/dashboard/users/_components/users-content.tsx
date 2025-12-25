"use client";

import { PasswordVerification } from "@/components/password-verification";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { UserList } from "./user-list";
import { UserOverview } from "./user-overview";

interface UsersContentProps {
  initialVerified: boolean;
}

export function UsersContent({ initialVerified }: UsersContentProps) {
  if (!initialVerified) {
    return (
      <PasswordVerification
        title="비밀번호 재확인"
        description="유저관리에 접근하기 위해 비밀번호를 입력해주세요."
        page="users"
        onVerified={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground text-xl font-bold">유저관리</h1>
        <p className="text-secondary-foreground mt-2 text-sm">유저 정보를 관리하세요</p>
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
