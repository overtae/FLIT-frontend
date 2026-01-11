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
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-foreground text-lg font-bold sm:text-xl">유저관리</h1>
          <p className="text-secondary-foreground mt-1 text-xs sm:mt-2 sm:text-sm">유저 정보를 관리하세요</p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="all" className="flex-1 sm:flex-initial">
              All
            </TabsTrigger>
            <TabsTrigger value="list" className="flex-1 sm:flex-initial">
              User List
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4 sm:mt-6">
            <UserOverview category="all" />
          </TabsContent>
          <TabsContent value="list" className="mt-4 sm:mt-6">
            <UserList />
          </TabsContent>
        </Tabs>
      </div>
    </PasswordVerificationProvider>
  );
}
