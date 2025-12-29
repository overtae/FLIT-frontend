"use client";

import { PasswordVerificationProvider } from "@/components/providers/password-verification-provider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { UserList } from "./user-list";
import { UserOverview } from "./user-overview";

interface UsersContentProps {
  initialVerified: boolean;
}

export function UsersContent({ initialVerified }: UsersContentProps) {
  return (
    <PasswordVerificationProvider initialVerified={initialVerified}>
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
    </PasswordVerificationProvider>
  );
}
